import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { slugify, calculateReadingTime, calculateSEOScore } from './seoUtils.ts'

describe('seoUtils', () => {
  it('slugifies titles cleanly', () => {
    assert.equal(
      slugify('The Aurelia: French Lace & Silk Ballgown!'),
      'the-aurelia-french-lace-silk-ballgown'
    )
  })

  it('calculates reading time based on word count', () => {
    const shortText = 'Bridal fitting guide for modern brides.'
    assert.equal(calculateReadingTime(shortText), 1)

    const longText = new Array(450).fill('gown').join(' ')
    assert.equal(calculateReadingTime(longText), 3)
  })

  it('awards a high SEO score when metadata and content meet bridal SEO criteria', () => {
    const longBody = new Array(280).fill('wedding gown rental luxury fitting').join(' ')
    const result = calculateSEOScore({
      title: 'Luxury Wedding Gown Rental & Custom Tailoring Guide in Jakarta',
      slug: 'luxury-wedding-gown-rental-custom-tailoring-guide',
      meta_title: 'Luxury Wedding Gown Rental & Custom Tailoring Guide | Elinboend',
      meta_description:
        'Explore our complete luxury wedding gown rental and custom tailoring guide at Elinboend Bridal Atelier to find your dream dress.',
      focus_keyword: 'wedding gown rental',
      canonical_url: '',
      excerpt: 'Explore our luxury wedding gown rental guide.',
      content: longBody,
      cover_image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261',
      cover_image_alt: 'Luxury wedding gown rental at Elinboend Bridal',
      category: 'Bridal Budget',
      tags: ['wedding gown rental'],
      author_name: 'Elin Boend',
      reading_time_minutes: 3,
      related_product_ids: ['eb-001'],
      status: 'published',
    })

    assert.equal(result.score, 100)
    assert.equal(result.ratingLabel, 'Excellent (SEO Optimized)')
  })
})

