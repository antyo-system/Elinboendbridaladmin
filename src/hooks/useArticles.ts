import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requireSupabase, isSupabaseConfigured, uploadMediaFile } from '../lib/supabase'
import type { Article, ArticleFormData, ArticleStatus } from '../types/article'

const ARTICLES_QUERY_KEY = ['bridal-articles']

type ArticleRow = Partial<Article> & { id: string }

function toArticle(row: ArticleRow): Article {
  const now = new Date().toISOString()
  return {
    id: row.id,
    title: row.title || 'Untitled Bridal Article',
    slug: row.slug || '',
    meta_title: row.meta_title ?? null,
    meta_description: row.meta_description ?? null,
    focus_keyword: row.focus_keyword ?? null,
    canonical_url: row.canonical_url ?? null,
    excerpt: row.excerpt ?? null,
    content: row.content || '',
    cover_image: row.cover_image ?? null,
    cover_image_alt: row.cover_image_alt ?? null,
    category: row.category || 'Silhouette Guide',
    tags: Array.isArray(row.tags) ? row.tags : [],
    author_name: row.author_name || 'Elin Boend, Lead Designer',
    reading_time_minutes: Number(row.reading_time_minutes ?? 4),
    related_product_ids: Array.isArray(row.related_product_ids) ? row.related_product_ids : [],
    status: row.status === 'published' ? 'published' : 'draft',
    views_count: Number(row.views_count ?? 0),
    published_at: row.published_at ?? null,
    created_at: row.created_at || now,
    updated_at: row.updated_at || row.created_at || now,
  }
}

/** Maps the editor payload to database columns. */
function toRow(payload: ArticleFormData) {
  const isPublished = payload.status === 'published'
  return {
    title: payload.title,
    slug: payload.slug,
    meta_title: payload.meta_title || payload.title,
    meta_description: payload.meta_description || payload.excerpt || null,
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
    published_at: isPublished ? payload.published_at || new Date().toISOString() : null,
  }
}

function friendlyError(message: string): Error {
  if (message.includes('duplicate key') && message.includes('slug')) {
    return new Error('An article with this URL slug already exists. Please change the slug.')
  }
  if (message.toLowerCase().includes('row-level security')) {
    return new Error('Your account is not allowed to modify articles.')
  }
  return new Error(message)
}

export function useArticles() {
  return useQuery({
    queryKey: ARTICLES_QUERY_KEY,
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await requireSupabase()
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw friendlyError(error.message)
      return (data as ArticleRow[]).map(toArticle)
    },
  })
}

export function useAddArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ArticleFormData): Promise<Article> => {
      const { data, error } = await requireSupabase()
        .from('articles')
        .insert(toRow(payload))
        .select()
        .single()

      if (error) throw friendlyError(error.message)
      return toArticle(data as ArticleRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY }),
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ArticleFormData): Promise<Article> => {
      if (!payload.id) throw new Error('Article ID is required for update')

      const { data, error } = await requireSupabase()
        .from('articles')
        .update(toRow(payload))
        .eq('id', payload.id)
        .select()
        .single()

      if (error) throw friendlyError(error.message)
      return toArticle(data as ArticleRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY }),
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await requireSupabase().from('articles').delete().eq('id', id)
      if (error) throw friendlyError(error.message)
      return id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY }),
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
    }): Promise<Article> => {
      const nextStatus: ArticleStatus = status === 'published' ? 'draft' : 'published'

      const { data, error } = await requireSupabase()
        .from('articles')
        .update({
          status: nextStatus,
          published_at: nextStatus === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw friendlyError(error.message)
      return toArticle(data as ArticleRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY }),
  })
}

export function uploadArticleCoverImage(file: File): Promise<string> {
  return uploadMediaFile(file, 'articles')
}
