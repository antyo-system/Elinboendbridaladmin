import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Article, ArticleFormData, ArticleStatus } from '../types/article'
import { INITIAL_BRIDAL_ARTICLES } from '../data/initialBridalData'

const LOCAL_ARTICLES_KEY = 'elinboend_bridal_admin_articles_v1'

function loadLocalArticles(): Article[] {
  try {
    const raw = localStorage.getItem(LOCAL_ARTICLES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(INITIAL_BRIDAL_ARTICLES))
  } catch {
    // Ignore storage error
  }
  return INITIAL_BRIDAL_ARTICLES
}

function saveLocalArticles(articles: Article[]) {
  try {
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(articles))
  } catch {
    // Ignore storage error
  }
}

export function useArticles() {
  return useQuery({
    queryKey: ['bridal-articles'],
    queryFn: async (): Promise<Article[]> => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && data && data.length > 0) {
            const mapped: Article[] = data.map((row: Record<string, unknown>, idx: number) => ({
              id: String(row.id || `art-${idx + 1}`),
              title: String(row.title || 'Untitled Bridal Article'),
              slug: String(row.slug || ''),
              meta_title: (row.meta_title as string) ?? String(row.title || ''),
              meta_description: (row.meta_description as string) ?? (row.excerpt as string) ?? '',
              focus_keyword: (row.focus_keyword as string) ?? '',
              canonical_url: (row.canonical_url as string) ?? '',
              excerpt: (row.excerpt as string) ?? '',
              content: String(row.content || ''),
              cover_image: (row.cover_image as string) ?? '',
              cover_image_alt: (row.cover_image_alt as string) ?? '',
              category: ((row.category as Article['category']) || 'Silhouette Guide'),
              tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
              author_name: String(row.author_name || row.author || 'Elin Boend, Lead Designer'),
              reading_time_minutes: Number(row.reading_time_minutes || 4),
              related_product_ids: Array.isArray(row.related_product_ids)
                ? (row.related_product_ids as string[])
                : [],
              status:
                row.status === 'draft' || row.is_published === false ? 'draft' : 'published',
              views_count: Number(row.views_count || 120),
              published_at: (row.published_at as string) ?? String(row.created_at || new Date().toISOString()),
              created_at: String(row.created_at || new Date().toISOString()),
              updated_at: String(row.updated_at || row.created_at || new Date().toISOString()),
            }))
            saveLocalArticles(mapped)
            return mapped
          }
        } catch (err) {
          console.warn('Supabase articles fetch fallback to local storage:', err)
        }
      }
      return loadLocalArticles()
    },
  })
}

export function useAddArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ArticleFormData): Promise<Article> => {
      const now = new Date().toISOString()
      const newArticle: Article = {
        id: `art-${Date.now().toString(36)}`,
        title: payload.title,
        slug: payload.slug,
        meta_title: payload.meta_title || payload.title,
        meta_description: payload.meta_description || payload.excerpt,
        focus_keyword: payload.focus_keyword || null,
        canonical_url: payload.canonical_url || null,
        excerpt: payload.excerpt || null,
        content: payload.content,
        cover_image: payload.cover_image || null,
        cover_image_alt: payload.cover_image_alt || null,
        category: payload.category,
        tags: payload.tags || [],
        author_name: payload.author_name || 'Elin Boend, Lead Designer',
        reading_time_minutes: payload.reading_time_minutes || 4,
        related_product_ids: payload.related_product_ids || [],
        status: payload.status,
        views_count: 1,
        published_at: payload.status === 'published' ? now : null,
        created_at: now,
        updated_at: now,
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .insert([
              {
                title: newArticle.title,
                slug: newArticle.slug,
                category: newArticle.category,
                excerpt: newArticle.excerpt,
                content: newArticle.content,
                cover_image: newArticle.cover_image || '',
                author_name: newArticle.author_name,
                read_time: `${newArticle.reading_time_minutes} min read`,
                is_published: newArticle.status === 'published',
              },
            ])
            .select()
            .single()

          if (!error && data) {
            newArticle.id = data.id
          }
        } catch (err) {
          console.warn('Saved new article locally:', err)
        }
      }

      const current = loadLocalArticles()
      saveLocalArticles([newArticle, ...current])
      return newArticle
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-articles'] })
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ArticleFormData): Promise<Article> => {
      if (!payload.id) throw new Error('Article ID is required for update')

      const now = new Date().toISOString()
      const current = loadLocalArticles()
      const existing = current.find((a) => a.id === payload.id)

      const updated: Article = {
        id: payload.id,
        title: payload.title,
        slug: payload.slug,
        meta_title: payload.meta_title || payload.title,
        meta_description: payload.meta_description || payload.excerpt,
        focus_keyword: payload.focus_keyword || null,
        canonical_url: payload.canonical_url || null,
        excerpt: payload.excerpt || null,
        content: payload.content,
        cover_image: payload.cover_image || null,
        cover_image_alt: payload.cover_image_alt || null,
        category: payload.category,
        tags: payload.tags || [],
        author_name: payload.author_name || 'Elin Boend, Lead Designer',
        reading_time_minutes: payload.reading_time_minutes || 4,
        related_product_ids: payload.related_product_ids || [],
        status: payload.status,
        views_count: existing?.views_count ?? 100,
        published_at:
          payload.status === 'published' ? payload.published_at || now : null,
        created_at: existing?.created_at || now,
        updated_at: now,
      }

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('articles')
            .update({
              title: updated.title,
              slug: updated.slug,
              category: updated.category,
              excerpt: updated.excerpt,
              content: updated.content,
              cover_image: updated.cover_image || '',
              author_name: updated.author_name,
              read_time: `${updated.reading_time_minutes} min read`,
              is_published: updated.status === 'published',
            })
            .eq('id', updated.id)
        } catch (err) {
          console.warn('Updated article locally:', err)
        }
      }

      const next = current.map((a) => (a.id === updated.id ? updated : a))
      saveLocalArticles(next)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-articles'] })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('articles').delete().eq('id', id)
        } catch (err) {
          console.warn('Deleted article locally:', err)
        }
      }
      const current = loadLocalArticles()
      saveLocalArticles(current.filter((a) => a.id !== id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-articles'] })
    },
  })
}

export function useTogglePublishArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: ArticleStatus
    }): Promise<Article | undefined> => {
      const nextStatus: ArticleStatus = status === 'published' ? 'draft' : 'published'
      const now = new Date().toISOString()

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('articles')
            .update({ is_published: nextStatus === 'published' })
            .eq('id', id)
        } catch (err) {
          console.warn('Toggled article status locally:', err)
        }
      }

      const current = loadLocalArticles()
      const next = current.map((a) =>
        a.id === id
          ? {
              ...a,
              status: nextStatus,
              published_at: nextStatus === 'published' ? now : null,
              updated_at: now,
            }
          : a
      )
      saveLocalArticles(next)
      return next.find((a) => a.id === id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-articles'] })
    },
  })
}

export async function uploadArticleCoverImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-covers')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('article-covers')
          .getPublicUrl(filePath)
        return publicUrlData.publicUrl
      }
    } catch {
      // Fallback to Data URL
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

