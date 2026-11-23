export const APP_VERSION = '0.3.3'

export interface ChangelogItem {
  version: string
  date: string
  title: string
  changes: string[]
}

export const CHANGELOG: ChangelogItem[] = [
  {
    version: '0.3.3',
    date: '2026-11-23',
    title: 'Streamlined Navigation: Products & Articles Focus',
    changes: [
      'Removed the Dashboard tab from navigation so the admin panel opens directly on Products (/products) alongside Articles & Blog (/articles) for immediate client handover.',
    ],
  },
  {
    version: '0.3.2',
    date: '2026-11-23',
    title: 'Built-in Publishable Supabase Fallback & Storefront Sort Fix',
    changes: [
      'Configured default publishable Supabase URL and key fallback in both Admin and Storefront clients so Vercel deployments connect automatically even before environment variables are manually added.',
      'Fixed storefront CatalogSection newest sort so Supabase created_at descending order is preserved instead of sorting alphabetically by UUID.',
    ],
  },
  {
    version: '0.3.1',
    date: '2026-11-09',
    title: 'Realtime Database Sync & Setup Guide',
    changes: [
      'Enabled Supabase Realtime for shared products and articles tables so the storefront can refresh published catalog changes automatically.',
      'Added storefront article subscriptions and stopped mock data from replacing a legitimately empty database result.',
      'Added a low-frequency storefront refresh to reconcile publication and availability changes hidden by public Row Level Security.',
      'Expanded the Indonesian Supabase setup guide with database, Auth, RLS, Realtime, Vercel, and end-to-end verification steps.',
      'Removed a database password from the example environment file.',
    ],
  },
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

