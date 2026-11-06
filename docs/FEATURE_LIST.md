# Feature List — Elinboend Bridal Admin (`v0.1.0`)

## 1. Core Admin Shell & Navigation (`AdminLayout.tsx`)
- Collapsible sidebar with hover-expand (`72px` collapsed / `256px` expanded).
- Strictly focused 3-item main navigation per the 5-Step Algorithm:
  1. **Dashboard** (`/`)
  2. **Products** (`/products`)
  3. **Articles & Blog** (`/articles`)
- Built-in **EN / ID Language Switcher** (defaults to English UI per global rules).
- Responsive Mobile Bottom Navigation Bar + slide-over drawer.

## 2. Executive Bridal Dashboard (`Dashboard.tsx`)
- **4 KPI Summary Cards**:
  - Total Gowns & Dresses (`Wedding Gowns` vs `Party Dresses` breakdown)
  - Avg. 3-Day Rental Price & Active Rental Inventory
  - Avg. Custom Purchase Price & Made-to-Measure Catalog Value
  - Published Bridal Journal Articles & Organic Views
- **Nominal Privacy Masking (`usePrivacyStore`)**: One-click `Hide Amounts` / `Show Amounts` (`Rp •••••••`).
- **Website Visitor & WhatsApp Concierge Analytics**: Real-time visitor count, WhatsApp fitting/order clicks (`+62 878-8011-1169`), conversion rate, and top-converting gowns.
- **Collection Breakdown & Quick Actions**: Visual distribution by Silhouette & Occasion + 1-click shortcuts to add a gown or publish an article.

## 3. Gown & Dress Catalog Management (`Products.tsx`)
- **Zero Flower/Flash-Sale Bloat**: No Flash Sale banner/timers, no flower freshness lots, no stem lengths, no floral recipe HPP tables.
- **Dual View Modes**: 4-column editorial card **Grid View** and dense **Table View**.
- **Bridal-Specific Attributes**:
  - SKU Code (`EB-001`) with 1-click Auto-generator
  - Product Type (`wedding_gown` | `party_dress`)
  - Silhouette (`Ballgown`, `A-Line`, `Mermaid`, `Sheath / Column`, `Modern Kebaya`)
  - Occasion (`Holy Matrimony`, `Wedding Reception`, `Evening Gala`, `Bridesmaid`, `Engagement / Sangjit`)
  - Color Name & Color Hex Swatch + Luxury Fabric specification
  - **3-Day Rental Pricing**: Rental Price, Original Price (strikethrough discount preview), Refundable Security Deposit, and `Rental Available` toggle
  - **Custom Purchase Pricing**: Custom Made Price, Original Price, and `Purchase Available` toggle
  - **Sizes Available**: Interactive multi-select pills (`XS`, `S`, `M`, `L`, `XL`, `Custom`)
  - **Google Merchant & Local Inventory**: `store_code` (`EB_ATELIER`), `pickup_sla`, `in_stock`
  - **Media Upload & Gallery Library**: Drag-and-drop photo upload + reusable image library picker.

## 4. Bridal Journal & SEO CMS (`Articles.tsx`)
- **Metrics Summary Bar**: Total Articles, Published, Drafts, Total Organic Views.
- **Inline 3-Tab Editor**:
  - **Tab 1 — Content & Media**: Title, auto-slug (`/articles/slug`), Bridal Category (`Silhouette Guide`, `Bridal Budget`, `Fitting & Care`, `Evening & Gala Styling`, `Kebaya & Heritage`, `Real Brides`), Author, Excerpt, Cover Image + SEO Alt Text, Substack-style Markdown Editor with WhatsApp Concierge CTA generator, and Tags.
  - **Tab 2 — SEO & SERP Auditor**: Focus Keyword, Meta Title (`65` chars), Meta Description (`160` chars), Desktop/Mobile Google SERP Snippet Preview, and live `0–100` SEO Checklist.
  - **Tab 3 — Gown Cross-Sell**: Attach recommended wedding gowns & party dresses to any article.

