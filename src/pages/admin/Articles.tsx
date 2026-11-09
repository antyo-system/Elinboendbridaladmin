import { useState, useMemo, useRef } from 'react'
import {
  Article as ArticleIcon,
  Plus,
  MagnifyingGlass,
  Eye,
  Pencil,
  Trash,
  CheckCircle,
  XCircle,
  WarningCircle,
  Sparkle,
  Globe,
  DeviceMobile,
  Desktop,
  Clock,
  UploadSimple,
  Dress,
  ListChecks,
  ArrowClockwise,
  FileText,
  X,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  useArticles,
  useAddArticle,
  useUpdateArticle,
  useDeleteArticle,
  useTogglePublishArticle,
  uploadArticleCoverImage,
} from '@/hooks/useArticles'
import { useProducts } from '@/hooks/useProducts'
import type { Article, ArticleFormData, ArticleCategory, ArticleStatus } from '@/types/article'
import { ARTICLE_CATEGORIES } from '@/constants/bridalOptions'
import { slugify, calculateReadingTime, calculateSEOScore } from '@/utils/seoUtils'
import { formatRp } from '@/utils/bridalPricing'
import { RichArticleEditor } from '@/components/admin/RichArticleEditor'

const DEFAULT_FORM_DATA: ArticleFormData = {
  title: '',
  slug: '',
  meta_title: '',
  meta_description: '',
  focus_keyword: '',
  canonical_url: '',
  excerpt: '',
  content: '',
  cover_image: '',
  cover_image_alt: '',
  category: 'Silhouette Guide',
  tags: ['wedding gown', 'bridal fitting', 'elinboend bridal'],
  author_name: 'Elin Boend, Lead Designer',
  reading_time_minutes: 4,
  related_product_ids: [],
  status: 'draft',
}

export default function AdminArticles() {
  const { data: articles = [], isLoading } = useArticles()
  const { data: products = [] } = useProducts()

  const addArticleMutation = useAddArticle()
  const updateArticleMutation = useUpdateArticle()
  const deleteArticleMutation = useDeleteArticle()
  const togglePublishMutation = useTogglePublishArticle()

  const formSectionRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedArticleForDelete, setSelectedArticleForDelete] = useState<Article | null>(null)

  const [formData, setFormData] = useState<ArticleFormData>(DEFAULT_FORM_DATA)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'products'>('content')
  const [isUploading, setIsUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const seoScoreResult = useMemo(() => calculateSEOScore(formData), [formData])

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.focus_keyword || '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        selectedCategory === 'all' || art.category === selectedCategory
      const matchStatus = statusFilter === 'all' || art.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [articles, searchQuery, selectedCategory, statusFilter])

  const stats = useMemo(() => {
    const total = articles.length
    const published = articles.filter((a) => a.status === 'published').length
    const draft = articles.filter((a) => a.status === 'draft').length
    const totalViews = articles.reduce((acc, a) => acc + (a.views_count || 0), 0)
    return { total, published, draft, totalViews }
  }, [articles])

  const handleToggleForm = () => {
    if (isEditorOpen) {
      setIsEditorOpen(false)
      setEditingId(null)
      setFormData({ ...DEFAULT_FORM_DATA })
    } else {
      setEditingId(null)
      setFormData({ ...DEFAULT_FORM_DATA })
      setTagInput('')
      setEditorTab('content')
      setIsEditorOpen(true)
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const handleOpenEditInline = (article: Article) => {
    setEditingId(article.id)
    setFormData({
      id: article.id,
      title: article.title,
      slug: article.slug,
      meta_title: article.meta_title || article.title,
      meta_description: article.meta_description || article.excerpt || '',
      focus_keyword: article.focus_keyword || '',
      canonical_url: article.canonical_url || '',
      excerpt: article.excerpt || '',
      content: article.content,
      cover_image: article.cover_image || '',
      cover_image_alt: article.cover_image_alt || '',
      category: article.category,
      tags: article.tags || [],
      author_name: article.author_name || 'Elin Boend, Lead Designer',
      reading_time_minutes: article.reading_time_minutes || 4,
      related_product_ids: article.related_product_ids || [],
      status: article.status,
      published_at: article.published_at,
    })
    setTagInput('')
    setEditorTab('content')
    setIsEditorOpen(true)

    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleOpenPreview = (article: Article) => {
    setFormData({
      id: article.id,
      title: article.title,
      slug: article.slug,
      meta_title: article.meta_title || article.title,
      meta_description: article.meta_description || article.excerpt || '',
      focus_keyword: article.focus_keyword || '',
      canonical_url: article.canonical_url || '',
      excerpt: article.excerpt || '',
      content: article.content,
      cover_image: article.cover_image || '',
      cover_image_alt: article.cover_image_alt || '',
      category: article.category,
      tags: article.tags || [],
      author_name: article.author_name || 'Elin Boend, Lead Designer',
      reading_time_minutes: article.reading_time_minutes || 4,
      related_product_ids: article.related_product_ids || [],
      status: article.status,
      published_at: article.published_at,
    })
    setIsPreviewOpen(true)
  }

  const handleTitleChange = (newTitle: string) => {
    const autoSlug = slugify(newTitle)
    const readingTime = calculateReadingTime(formData.content)
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.id ? prev.slug : autoSlug,
      meta_title:
        prev.meta_title === prev.title ? newTitle : prev.meta_title || newTitle,
      reading_time_minutes: readingTime,
    }))
  }

  const handleContentChange = (newContent: string) => {
    const readingTime = calculateReadingTime(newContent)
    setFormData((prev) => ({
      ...prev,
      content: newContent,
      reading_time_minutes: readingTime,
    }))
  }

  const handleRegenerateSlug = () => {
    if (!formData.title) return
    setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }))
    toast.info('Generated SEO-friendly URL slug.')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const imageUrl = await uploadArticleCoverImage(file)
      setFormData((prev) => ({
        ...prev,
        cover_image: imageUrl,
        cover_image_alt:
          prev.cover_image_alt || `Cover image for ${prev.title || 'bridal article'}`,
      }))
      toast.success('Cover image uploaded successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleTagAdd = () => {
    if (!tagInput.trim()) return
    const newTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    setFormData((prev) => ({
      ...prev,
      tags: Array.from(new Set([...prev.tags, ...newTags])),
    }))
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  const handleToggleProductRelation = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.related_product_ids.includes(productId)
      const nextIds = exists
        ? prev.related_product_ids.filter((id) => id !== productId)
        : [...prev.related_product_ids, productId]
      return { ...prev, related_product_ids: nextIds }
    })
  }

  const handleSaveArticle = async (statusOverride?: ArticleStatus) => {
    if (!formData.title.trim()) {
      toast.error('Article Title is required!')
      return
    }
    if (!formData.slug.trim()) {
      toast.error('URL Slug is required!')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Article Content cannot be empty!')
      return
    }

    const payload: ArticleFormData = {
      ...formData,
      id: editingId || formData.id,
      status: statusOverride || formData.status,
      reading_time_minutes: calculateReadingTime(formData.content),
    }

    try {
      if (editingId) {
        await updateArticleMutation.mutateAsync(payload)
        toast.success('Bridal article updated successfully!')
      } else {
        await addArticleMutation.mutateAsync(payload)
        toast.success('Bridal article published successfully!')
      }
      setIsEditorOpen(false)
      setEditingId(null)
      setFormData({ ...DEFAULT_FORM_DATA })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save article.')
    }
  }

  const handleToggleStatus = async (article: Article) => {
    try {
      await togglePublishMutation.mutateAsync({
        id: article.id,
        status: article.status,
      })
      const nextStatus = article.status === 'published' ? 'Draft' : 'Published'
      toast.success(`Article status changed to ${nextStatus}.`)
    } catch {
      toast.error('Failed to update article status.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedArticleForDelete) return
    try {
      await deleteArticleMutation.mutateAsync(selectedArticleForDelete.id)
      toast.success('Article deleted successfully.')
      setIsDeleteConfirmOpen(false)
      setSelectedArticleForDelete(null)
    } catch {
      toast.error('Failed to delete article.')
    }
  }

  const getSEOScoreBadgeClass = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (score >= 45) return 'bg-amber-100 text-amber-800 border-amber-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm mb-1">
            <ArticleIcon size={20} weight="fill" />
            <span>Bridal Journal &amp; SEO CMS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Articles &amp; Blog Management
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Publish high-converting bridal styling guides, optimize Google SEO rankings, and cross-sell wedding gowns.
          </p>
        </div>

        <Button
          onClick={handleToggleForm}
          className={
            isEditorOpen
              ? 'bg-stone-200 text-stone-800 hover:bg-stone-300 font-medium transition-all'
              : 'bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-xs transition-all'
          }
        >
          {isEditorOpen ? (
            <>
              <X size={18} weight="bold" className="mr-2" />
              Cancel / Close Form
            </>
          ) : (
            <>
              <Plus size={18} weight="bold" className="mr-2" />
              Create New Article
            </>
          )}
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      {!isEditorOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-stone-200">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <span>Total Articles</span>
              <FileText size={18} className="text-stone-400" />
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-2">{stats.total}</p>
          </Card>

          <Card className="p-4 bg-white border-stone-200">
            <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold uppercase tracking-wider">
              <span>Published</span>
              <CheckCircle size={18} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.published}</p>
          </Card>

          <Card className="p-4 bg-white border-stone-200">
            <div className="flex items-center justify-between text-amber-600 text-xs font-semibold uppercase tracking-wider">
              <span>Drafts</span>
              <Pencil size={18} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-700 mt-2">{stats.draft}</p>
          </Card>

          <Card className="p-4 bg-white border-stone-200">
            <div className="flex items-center justify-between text-blue-600 text-xs font-semibold uppercase tracking-wider">
              <span>Total Organic Views</span>
              <Eye size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {stats.totalViews.toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      {/* INLINE ARTICLE EDITOR FORM */}
      {isEditorOpen && (
        <div ref={formSectionRef}>
          <Card className="p-6 bg-white border border-stone-200 shadow-xs rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {editingId ? 'Edit Bridal Article & SEO Settings' : 'Create New Bridal Article'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Optimize your bridal editorial for Google search rankings and private fitting conversions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${getSEOScoreBadgeClass(
                    seoScoreResult.score
                  )}`}
                >
                  <Sparkle size={14} weight="fill" /> SEO Score: {seoScoreResult.score} / 100
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditorOpen(false)}
                  className="h-8 w-8 text-stone-400 hover:text-stone-700"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Editor Tabs Navigation */}
            <div className="flex border-b border-stone-200 -mt-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  editorTab === 'content'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <FileText size={16} /> Content &amp; Media
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('seo')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  editorTab === 'seo'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Globe size={16} /> SEO &amp; SERP Auditor
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    seoScoreResult.score >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : seoScoreResult.score >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {seoScoreResult.score}/100
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('products')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  editorTab === 'products'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Dress size={16} /> Gown Cross-Sell ({formData.related_product_ids.length})
              </button>
            </div>

            {/* Tab 1: Content & Media */}
            {editorTab === 'content' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-bold text-stone-700">
                    Article Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Ultimate Guide to Choosing Your Dream Wedding Gown Silhouette"
                    className="font-semibold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="text-xs font-bold text-stone-700">
                      URL Slug *
                    </Label>
                    <button
                      type="button"
                      onClick={handleRegenerateSlug}
                      className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowClockwise size={12} /> Auto-generate Slug
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-2 text-xs bg-stone-200 border border-r-0 border-stone-300 text-stone-600 rounded-l-lg font-mono">
                      /articles/
                    </span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                      }
                      placeholder="ultimate-guide-choosing-wedding-gown-silhouette"
                      className="rounded-l-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-bold text-stone-700">
                      Editorial Category *
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as ArticleCategory,
                        }))
                      }
                      className="w-full h-10 px-3 text-xs bg-white border border-stone-200 rounded-lg font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                    >
                      {ARTICLE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="author" className="text-xs font-bold text-stone-700">
                      Author Name
                    </Label>
                    <Input
                      id="author"
                      value={formData.author_name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, author_name: e.target.value }))
                      }
                      placeholder="Elin Boend, Lead Designer"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="excerpt" className="text-xs font-bold text-stone-700">
                    Excerpt / Short Editorial Summary
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                    }
                    placeholder="Brief 1-2 sentence preview for journal cards and search snippets..."
                    rows={2}
                    className="text-xs"
                  />
                </div>

                {/* Cover Image Upload & Alt Text */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <Label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                    <span>Cover Image &amp; Alt Text (Mandatory for Google Image SEO)</span>
                    <span className="text-[11px] text-stone-400 font-normal">
                      Recommended ratio 16:9
                    </span>
                  </Label>

                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {formData.cover_image ? (
                      <div className="relative group w-36 h-24 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100">
                        <img
                          src={formData.cover_image}
                          alt={formData.cover_image_alt || 'Cover preview'}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, cover_image: '' }))
                          }
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-36 h-24 rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 bg-white shrink-0">
                        <UploadSimple size={24} />
                        <span className="text-[10px] mt-1">No Cover</span>
                      </div>
                    )}

                    <div className="flex-1 space-y-2.5 w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700"
                      />
                      <Input
                        value={formData.cover_image}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cover_image: e.target.value }))
                        }
                        placeholder="Or paste Cover Image URL (https://images.unsplash.com/...)"
                        className="text-xs h-9"
                      />
                      <Input
                        value={formData.cover_image_alt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cover_image_alt: e.target.value,
                          }))
                        }
                        placeholder="Image Alt Text (e.g. Luxury French Lace Ballgown Fitting at Elinboend Bridal)"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Rich Article Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-stone-700">
                      Article Content &amp; Formatting *
                    </Label>
                    <span className="text-[11px] text-stone-500 font-mono">
                      ~{formData.reading_time_minutes} min read
                    </span>
                  </div>

                  <RichArticleEditor
                    value={formData.content}
                    onChange={(newVal) => handleContentChange(newVal)}
                    readingTimeMinutes={formData.reading_time_minutes}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <Label className="text-xs font-bold text-stone-700">Tags (Keywords)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleTagAdd()
                        }
                      }}
                      placeholder="Type tags separated by comma (e.g. wedding gown, ballgown, kebaya) & press Enter"
                      className="text-xs"
                    />
                    <Button
                      type="button"
                      onClick={handleTagAdd}
                      variant="outline"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-stone-700 border border-stone-300 shadow-2xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: SEO & SERP Preview */}
            {editorTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Globe size={18} className="text-pink-600" /> Search Engine Metadata
                  </h3>

                  <div className="space-y-1.5">
                    <Label htmlFor="focus_keyword" className="text-xs font-bold text-stone-700">
                      Focus Keyword *
                    </Label>
                    <Input
                      id="focus_keyword"
                      value={formData.focus_keyword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          focus_keyword: e.target.value,
                        }))
                      }
                      placeholder="e.g. wedding gown rental"
                      className="text-xs font-semibold text-pink-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="meta_title" className="text-xs font-bold text-stone-700">
                        Google Meta Title
                      </Label>
                      <span
                        className={`text-[11px] font-mono ${
                          (formData.meta_title || '').length > 65
                            ? 'text-red-500 font-bold'
                            : 'text-stone-400'
                        }`}
                      >
                        {(formData.meta_title || '').length} / 65 chars
                      </span>
                    </div>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, meta_title: e.target.value }))
                      }
                      placeholder={formData.title || 'SEO Title for Google SERP...'}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="meta_desc" className="text-xs font-bold text-stone-700">
                        Google Meta Description
                      </Label>
                      <span
                        className={`text-[11px] font-mono ${
                          (formData.meta_description || '').length > 160
                            ? 'text-red-500 font-bold'
                            : 'text-stone-400'
                        }`}
                      >
                        {(formData.meta_description || '').length} / 160 chars
                      </span>
                    </div>
                    <Textarea
                      id="meta_desc"
                      value={formData.meta_description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          meta_description: e.target.value,
                        }))
                      }
                      placeholder="Compelling 110–160 character meta description that entices brides to click..."
                      rows={3}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Live Google SERP Preview */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <MagnifyingGlass size={18} className="text-blue-600" /> Live Google SERP Preview
                    </h3>

                    <div className="flex bg-white p-1 rounded-lg border border-stone-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                          previewDevice === 'desktop'
                            ? 'bg-stone-100 text-stone-900 font-bold'
                            : 'text-stone-500'
                        }`}
                      >
                        <Desktop size={14} /> Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                          previewDevice === 'mobile'
                            ? 'bg-stone-100 text-stone-900 font-bold'
                            : 'text-stone-500'
                        }`}
                      >
                        <DeviceMobile size={14} /> Mobile
                      </button>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border border-stone-200 bg-white shadow-2xs ${
                      previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                      <div className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-[10px]">
                        EB
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-stone-800 leading-none">
                          Elinboend Bridal
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          https://elinboendbridal.com › articles ›{' '}
                          {formData.slug || 'url-slug'}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer line-clamp-1">
                      {formData.meta_title ||
                        formData.title ||
                        'Untitled Bridal Article - Elinboend Bridal'}
                    </h4>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {formData.meta_description ||
                        formData.excerpt ||
                        'Write a meta description to preview how your bridal article appears in Google search results...'}
                    </p>
                  </div>
                </div>

                {/* SEO Quality Checklist */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <ListChecks size={18} className="text-emerald-600" /> SEO Optimization Checklist
                    </h3>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSEOScoreBadgeClass(
                        seoScoreResult.score
                      )}`}
                    >
                      {seoScoreResult.ratingLabel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {seoScoreResult.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2.5 text-xs p-2.5 rounded-lg bg-white border border-stone-200"
                      >
                        {item.status === 'good' && (
                          <CheckCircle
                            size={16}
                            weight="fill"
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                        )}
                        {item.status === 'warning' && (
                          <WarningCircle
                            size={16}
                            weight="fill"
                            className="text-amber-500 shrink-0 mt-0.5"
                          />
                        )}
                        {item.status === 'error' && (
                          <XCircle
                            size={16}
                            weight="fill"
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                        )}

                        <div>
                          <p className="font-bold text-stone-800">{item.label}</p>
                          <p className="text-stone-500 mt-0.5">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gown Cross-Sell */}
            {editorTab === 'products' && (
              <div className="space-y-4">
                <div className="bg-pink-50/70 border border-pink-200 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-pink-900">
                    Recommended Wedding Gowns &amp; Party Dresses
                  </h3>
                  <p className="text-xs text-pink-800/80 mt-0.5">
                    Select gowns from your catalog to showcase at the bottom of this bridal article.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((prod) => {
                    const selected = formData.related_product_ids.includes(prod.id)
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleToggleProductRelation(prod.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'border-pink-500 bg-pink-50/60 ring-1 ring-pink-300'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={prod.images?.[0]}
                          alt={prod.title}
                          className="w-12 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {prod.title}
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {prod.silhouette} · {prod.occasion}
                          </p>
                          <p className="text-[11px] font-bold text-pink-600 mt-0.5">
                            {formatRp(prod.rental_price)} / 3d
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            selected
                              ? 'bg-pink-600 text-white'
                              : 'border border-stone-300 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Editor Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditorOpen(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSaveArticle('draft')}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSaveArticle('published')}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6"
                >
                  {editingId ? 'Save & Publish Changes' : 'Publish Article'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search & Filter Bar */}
      <Card className="p-4 bg-white border-stone-200">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <Input
              placeholder="Search articles by title, slug, or focus keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-pink-600 font-bold shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Articles List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 rounded-xl bg-white border border-stone-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card className="p-12 text-center bg-white border-stone-200">
          <ArticleIcon size={48} className="mx-auto text-stone-300 mb-3" />
          <h3 className="text-base font-bold text-stone-700">No Bridal Articles Found</h3>
          <p className="text-xs text-stone-400 mt-1">
            Create your first bridal styling guide or adjust your search filters.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map((article) => {
            const liveSeo = calculateSEOScore({
              title: article.title,
              slug: article.slug,
              meta_title: article.meta_title || article.title,
              meta_description: article.meta_description || article.excerpt || '',
              focus_keyword: article.focus_keyword || '',
              canonical_url: article.canonical_url || '',
              excerpt: article.excerpt || '',
              content: article.content,
              cover_image: article.cover_image || '',
              cover_image_alt: article.cover_image_alt || '',
              category: article.category,
              tags: article.tags || [],
              author_name: article.author_name,
              reading_time_minutes: article.reading_time_minutes,
              related_product_ids: article.related_product_ids || [],
              status: article.status,
            })

            return (
              <Card
                key={article.id}
                className="p-4 sm:p-5 bg-white border border-stone-200 hover:border-pink-200 transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Cover Thumbnail */}
                  <div
                    onClick={() => handleOpenPreview(article)}
                    className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer group"
                  >
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.cover_image_alt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ArticleIcon size={32} />
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-pink-50 text-pink-700 border border-pink-200"
                      >
                        {article.category}
                      </Badge>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          article.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {article.status === 'published' ? '● Published' : '○ Draft'}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSEOScoreBadgeClass(
                          liveSeo.score
                        )}`}
                      >
                        SEO: {liveSeo.score}/100
                      </span>

                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock size={13} /> {article.reading_time_minutes} min read
                      </span>

                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Eye size={13} /> {(article.views_count || 0).toLocaleString()} views
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenEditInline(article)}
                      className="text-base font-bold text-stone-900 hover:text-pink-600 cursor-pointer leading-snug"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span>By {article.author_name}</span>
                        {article.focus_keyword && (
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                            🎯 {article.focus_keyword}
                          </span>
                        )}
                        {article.related_product_ids?.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 font-semibold">
                            👗 {article.related_product_ids.length} Linked Gowns
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPreview(article)}
                          className="h-8 text-xs"
                        >
                          <Eye size={14} className="mr-1" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(article)}
                          className="h-8 text-xs"
                        >
                          {article.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditInline(article)}
                          className="h-8 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedArticleForDelete(article)
                            setIsDeleteConfirmOpen(true)
                          }}
                          className="h-8 text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Article Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-stone-900">
              {formData.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formData.cover_image && (
              <img
                src={formData.cover_image}
                alt={formData.cover_image_alt || formData.title}
                className="w-full h-56 object-cover rounded-xl border border-stone-200"
              />
            )}
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="font-bold text-pink-600">{formData.category}</span>
              <span>•</span>
              <span>{formData.author_name}</span>
              <span>•</span>
              <span>{formData.reading_time_minutes} min read</span>
            </div>
            <div className="prose prose-sm max-w-none space-y-2 text-sm text-stone-700 whitespace-pre-line leading-relaxed">
              {formData.content}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Delete Bridal Article?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-stone-600 py-2">
            Are you sure you want to permanently delete{' '}
            <strong>&ldquo;{selectedArticleForDelete?.title}&rdquo;</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

