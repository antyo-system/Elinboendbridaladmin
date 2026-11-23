# Changelog — Elinboend Bridal Admin

All notable changes to **Elinboend Bridal Admin Panel** are documented in this file.

## [0.3.3] - 2026-11-23
### Simplified (5-Step Algorithm)
- **Focused Navigation (`Products` & `Articles & Blog`)**: Removed the `Dashboard` tab from the sidebar and mobile navigation bar and set `/products` as the default landing screen after sign-in for streamlined client handover.

## [0.3.2] - 2026-11-23
### Fixed
- **Zero-Config Storefront & Admin Supabase Fallback**: Added built-in fallback for the public Supabase project URL (`https://atbnjwuuzylbalibqrwo.supabase.co`) and publishable key (`sb_publishable_...`) in `src/lib/supabase.ts` across both repositories so Vercel production builds never fall back to static mock data if env vars were not yet applied to the storefront project.
- **Storefront Newest Sort Order**: Fixed `CatalogSection.tsx` in `Elinboendbridal` so `SORT BY: NEWEST` preserves Supabase's `created_at DESC` ordering instead of sorting by random UUID strings.

## [0.3.1] - 2026-11-09
### Fixed & Improved
- **Automatic Storefront Refresh**: Added `products` and `articles` to the Supabase Realtime publication and connected the storefront article query to live changes.
- **Empty Database Handling**: A genuinely empty Supabase table now stays empty instead of displaying mock catalog content.
- **Visibility State Reconciliation**: Storefront queries recheck every 30 seconds while the tab is active so RLS-hidden publish/unpublish transitions are reflected.
- **Database Setup Guide**: Expanded the Indonesian setup walkthrough with RLS, Auth, Realtime, Vercel, and end-to-end verification steps.
- **Credential Hygiene**: Removed the database password from `.env.example`; rotate the password if it was used outside this local project.

## [0.3.0] - 2026-11-09
### Added & Synchronized
- **Shared Server Database Architecture**: Configured a unified PostgreSQL server database schema (`supabase/schema.sql`) and initial catalog seed (`supabase/seed.sql`) shared by both `admin.elinboendbridal.com` and `www.elinboendbridal.com` on Supabase free tier.
- **Server Media Storage**: Gown photos and article cover uploads now store directly in Supabase Storage bucket (`media/products` and `media/articles`) with public CDN URLs instead of base64 data URLs.
- **Storefront Real-time Sync**: Updated `Elinboendbridal` storefront (`CatalogSection`, `ProductDetail`, `Home`, `Articles`, `ArticleDetail`) to fetch live server data with graceful fallback to mock data during initial load.
- **Setup Documentation**: Added complete step-by-step setup guide in `docs/DATABASE_SYNC_SETUP.md`.

## [0.2.0] - 2026-11-06
### Security & Visual Alignment
- **Mandatory Admin Login (`/login`)**: Removed auto-authenticated demo sessions and one-click demo bypass buttons. Visiting `/` or any protected route without a verified session now strictly redirects to `/login`.
- **Credential Validation & Brute-Force Protection**: Added Supabase Auth + Atelier Admin credential verification (`VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`), 12-hour session expiry, show/hide password toggle, and 60-second lockout after 5 failed attempts.
- **Storefront Design Sync**: Synced `Cormorant Garamond` + `Plus Jakarta Sans` fonts and Warm Bronze / Champagne / Editorial Charcoal design tokens with `Elinboendbridal`.

## [0.1.0] - 2026-11-06
### Added
- **Streamlined Admin Layout**: Collapsible desktop sidebar, mobile bottom navigation bar, bilingual EN/ID switcher (default English), and session/demo authentication.
- **Dashboard (`/`)**:
  - High-signal summary cards: Total Gowns & Dresses, Rental Catalog Value (3-Day), Custom Made Catalog Value, and Published Journal Articles.
  - Website Visitor & WhatsApp Concierge (`+62 878-8011-1169`) Conversion Analytics widget with top-converting bridal gowns.
  - Privacy toggle (`Hide Amounts` / `Show Amounts`) to mask IDR figures in public spaces.
  - Quick Action shortcuts to add a new gown/dress or write a new bridal journal article.
- **Products & Pricing Catalog (`/products`)**:
  - Adapted from the Kembang Seladang admin template exclusively for **Elinboend Bridal — Exclusive Wedding Gowns & Party Dresses** (with Flash Sale, flower freshness lots, stem grade HPP, and floral supply chain stripped out per the 5-Step Algorithm).
  - Grid & Table view modes, live search, and expandable filters by **Product Type** (`Wedding Gown`, `Party Dress`), **Silhouette** (`Ballgown`, `A-Line`, `Mermaid`, `Sheath / Column`, `Modern Kebaya`), **Occasion** (`Holy Matrimony`, `Wedding Reception`, `Evening Gala`, `Bridesmaid`, `Engagement / Sangjit`), and **Live Status**.
  - Inline Add / Edit Gown Form with Auto SKU generator (`EB-001`), Auto Title generator, 3-Day Rental Price & Original Strikethrough Price, Custom Purchase Price & Original Strikethrough Price, Refundable Security Deposit, Size Availability pills (`XS`, `S`, `M`, `L`, `XL`, `Custom`), Color swatch & Fabric specs, Google Merchant Local Inventory settings (`EB_ATELIER`, `pickup_sla`, `in_stock`), and Drag & Drop Media Upload + Gallery Library modal.
  - Full-screen / modal Product Detail Preview with Rental vs. Purchase breakdown and direct Edit trigger.
- **Articles & Bridal Journal CMS (`/articles`)**:
  - Inline 3-tab Article & SEO Editor: **Content & Media**, **SEO & SERP Auditor (0–100 score)**, and **Gown Cross-Sell Selector**.
  - Substack-style rich markdown editor with live preview and instant WhatsApp Concierge CTA button generator (`+62 878-8011-1169`).

