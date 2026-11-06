export type ArticleStatus = 'draft' | 'published'

export type ArticleCategory =
  | 'Silhouette Guide'
  | 'Bridal Budget'
  | 'Fitting & Care'
  | 'Evening & Gala Styling'
  | 'Kebaya & Heritage'
  | 'Real Brides'

export interface Article {
  id: string
  title: string
  slug: string
  meta_title?: string | null
  meta_description?: string | null
  focus_keyword?: string | null
  canonical_url?: string | null
  excerpt?: string | null
  content: string
  cover_image?: string | null
  cover_image_alt?: string | null
  category: ArticleCategory
  tags: string[]
  author_name: string
  reading_time_minutes: number
  related_product_ids: string[]
  status: ArticleStatus
  views_count: number
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface ArticleFormData {
  id?: string
  title: string
  slug: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  canonical_url: string
  excerpt: string
  content: string
  cover_image: string
  cover_image_alt: string
  category: ArticleCategory
  tags: string[]
  author_name: string
  reading_time_minutes: number
  related_product_ids: string[]
  status: ArticleStatus
  published_at?: string | null
}

export interface SEOCheckItem {
  id: string
  label: string
  status: 'good' | 'warning' | 'error'
  message: string
}

export interface SEOScoreResult {
  score: number
  ratingLabel: 'Needs Work' | 'Fair' | 'Good' | 'Excellent (SEO Optimized)'
  checklist: SEOCheckItem[]
}

