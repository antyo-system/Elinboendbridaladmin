export const APP_VERSION = '0.3.0'

export interface ChangelogItem {
  version: string
  date: string
  title: string
  changes: string[]
}

export const CHANGELOG: ChangelogItem[] = [
  {
    version: '0.3.0',
    date: '2026-11-09',
    title: 'Shared Server Database Synchronization (Products & Articles)',
    changes: [
      'Connected both admin.elinboendbridal.com and www.elinboendbridal.com to a shared PostgreSQL server database on Supabase (Free Tier).',
      'Created supabase/schema.sql and supabase/seed.sql defining live products, published articles, RLS policies, and media storage bucket.',
      'Refactored admin product and article mutations to directly persist to Supabase server with direct image uploads to the public media bucket.',
      'Integrated storefront data hooks (useProducts, useArticles) with automatic live data fetching and graceful offline mock fallback.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-11-06',
    title: 'Strict Admin Authentication & Brand Visual Alignment',
    changes: [
      'Removed auto-login and quick-demo bypass buttons: all routes now strictly require authenticated admin credentials before entering the panel.',
      'Added 12-hour expiring session token validation, password visibility toggle, and 5-attempt brute-force lockout protection on /login.',
      'Aligned typography (Cormorant Garamond + Plus Jakarta Sans) and warm bronze-gold/champagne color tokens with the main Elinboend Bridal storefront.',
    ],
  },
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

