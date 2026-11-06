import type { ArticleFormData, SEOScoreResult, SEOCheckItem } from '../types/article.ts'

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function calculateReadingTime(content: string): number {
  if (!content || !content.trim()) return 1
  const cleanText = content.replace(/<[^>]*>/g, '').trim()
  const wordCount = cleanText.split(/\s+/).length
  const minutes = Math.ceil(wordCount / 200)
  return Math.max(1, minutes)
}

export function calculateSEOScore(formData: ArticleFormData): SEOScoreResult {
  const checklist: SEOCheckItem[] = []
  let points = 0
  const maxPoints = 100

  const keyword = (formData.focus_keyword || '').toLowerCase().trim()
  const title = (formData.title || '').trim()
  const metaTitle = (formData.meta_title || title).trim()
  const metaDesc = (formData.meta_description || '').trim()
  const slug = (formData.slug || '').trim()
  const content = (formData.content || '').trim()
  const coverAlt = (formData.cover_image_alt || '').trim()

  // 1. Meta Title Length Check (15 pts)
  if (metaTitle.length >= 40 && metaTitle.length <= 65) {
    points += 15
    checklist.push({
      id: 'title_length',
      label: 'Meta Title Length',
      status: 'good',
      message: `Optimal meta title length (${metaTitle.length} chars; recommended 40–65).`,
    })
  } else if (metaTitle.length > 0) {
    points += 7
    checklist.push({
      id: 'title_length',
      label: 'Meta Title Length',
      status: 'warning',
      message: `Current title is ${metaTitle.length} chars. Aim for 40–65 chars for best Google SERP display.`,
    })
  } else {
    checklist.push({
      id: 'title_length',
      label: 'Meta Title Length',
      status: 'error',
      message: 'Article title / meta title is missing.',
    })
  }

  // 2. Focus Keyword in Title Check (15 pts)
  if (keyword && metaTitle.toLowerCase().includes(keyword)) {
    points += 15
    checklist.push({
      id: 'keyword_in_title',
      label: 'Focus Keyword in Title',
      status: 'good',
      message: `Focus keyword "${keyword}" appears in the Meta Title.`,
    })
  } else if (keyword) {
    checklist.push({
      id: 'keyword_in_title',
      label: 'Focus Keyword in Title',
      status: 'error',
      message: `Focus keyword "${keyword}" was not found in the Meta Title.`,
    })
  } else {
    checklist.push({
      id: 'keyword_in_title',
      label: 'Focus Keyword in Title',
      status: 'warning',
      message: 'Define a target focus keyword (e.g. "wedding gown rental").',
    })
  }

  // 3. Meta Description Length (15 pts)
  if (metaDesc.length >= 110 && metaDesc.length <= 160) {
    points += 15
    checklist.push({
      id: 'meta_desc_length',
      label: 'Meta Description Length',
      status: 'good',
      message: `Ideal meta description (${metaDesc.length} chars; recommended 110–160).`,
    })
  } else if (metaDesc.length > 0) {
    points += 7
    checklist.push({
      id: 'meta_desc_length',
      label: 'Meta Description Length',
      status: 'warning',
      message: `Meta description is ${metaDesc.length} chars (recommended 110–160 chars).`,
    })
  } else {
    checklist.push({
      id: 'meta_desc_length',
      label: 'Meta Description Length',
      status: 'error',
      message: 'Meta description is empty.',
    })
  }

  // 4. Focus Keyword in Meta Description (15 pts)
  if (keyword && metaDesc.toLowerCase().includes(keyword)) {
    points += 15
    checklist.push({
      id: 'keyword_in_meta_desc',
      label: 'Keyword in Meta Description',
      status: 'good',
      message: `Focus keyword "${keyword}" is included in the Meta Description.`,
    })
  } else if (keyword) {
    checklist.push({
      id: 'keyword_in_meta_desc',
      label: 'Keyword in Meta Description',
      status: 'error',
      message: `Include "${keyword}" in your Meta Description to improve click-through rates.`,
    })
  }

  // 5. Keyword in URL Slug (15 pts)
  if (keyword && slug.toLowerCase().includes(slugify(keyword))) {
    points += 15
    checklist.push({
      id: 'keyword_in_slug',
      label: 'Keyword in URL Slug',
      status: 'good',
      message: 'URL slug contains the target focus keyword.',
    })
  } else if (keyword) {
    checklist.push({
      id: 'keyword_in_slug',
      label: 'Keyword in URL Slug',
      status: 'warning',
      message: 'URL slug does not yet contain the focus keyword.',
    })
  }

  // 6. Content Depth (15 pts)
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  if (wordCount >= 250) {
    points += 15
    checklist.push({
      id: 'word_count',
      label: 'Editorial Content Depth',
      status: 'good',
      message: `Comprehensive article depth (${wordCount} words).`,
    })
  } else if (wordCount >= 120) {
    points += 8
    checklist.push({
      id: 'word_count',
      label: 'Editorial Content Depth',
      status: 'warning',
      message: `Article has ${wordCount} words. Aim for 250+ words for stronger organic ranking.`,
    })
  } else {
    checklist.push({
      id: 'word_count',
      label: 'Editorial Content Depth',
      status: 'error',
      message: `Content is too short (${wordCount} words). Write at least 120 words.`,
    })
  }

  // 7. Cover Image & Alt Text (10 pts)
  if (formData.cover_image && coverAlt.length >= 5) {
    points += 10
    checklist.push({
      id: 'cover_alt',
      label: 'Cover Image SEO Alt Text',
      status: 'good',
      message: 'Cover image includes descriptive SEO alt text.',
    })
  } else if (formData.cover_image) {
    checklist.push({
      id: 'cover_alt',
      label: 'Cover Image SEO Alt Text',
      status: 'warning',
      message: 'Add descriptive Alt Text to the cover image for Google Image indexing.',
    })
  } else {
    checklist.push({
      id: 'cover_alt',
      label: 'Cover Image SEO Alt Text',
      status: 'warning',
      message: 'No cover image uploaded yet.',
    })
  }

  const score = Math.min(maxPoints, points)

  let ratingLabel: SEOScoreResult['ratingLabel'] = 'Needs Work'
  if (score >= 85) ratingLabel = 'Excellent (SEO Optimized)'
  else if (score >= 70) ratingLabel = 'Good'
  else if (score >= 45) ratingLabel = 'Fair'

  return { score, ratingLabel, checklist }
}

