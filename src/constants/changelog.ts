export const APP_VERSION = '0.1.0'

export interface ChangelogItem {
  version: string
  date: string
  title: string
  changes: string[]
}

export const CHANGELOG: ChangelogItem[] = [
  {
    version: '0.1.0',
    date: '2026-11-06',
    title: 'Initial Release — Elinboend Bridal Lean Admin Panel',
    changes: [
      'Streamlined 3-Module Architecture: Dashboard, Products (Wedding Gowns & Party Dresses), and Articles & Blog (Bridal Journal SEO CMS).',
      '5-Step Algorithm Applied: Removed Flash Sale banners/timers, flower freshness lots, stem grade HPP matrices, and floral supply chain bloat.',
      'Couture Product Management: Full support for 3-Day Rental Pricing, Custom Made-to-Measure Pricing, Refundable Security Deposit, Silhouette, Occasion, Fabric, Color Swatch, Sizes (XS–Custom), and Google Merchant Local Inventory.',
      'Editorial Bridal Journal CMS: Inline Substack-style editor, live Google SERP snippet preview, 0–100 SEO Score Auditor, WhatsApp Concierge CTA generator (+62 878-8011-1169), and Gown Cross-Sell selector.',
    ],
  },
]

