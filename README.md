# Elinboend Bridal — Admin Panel (`elinboendbridaladmin`)

A streamlined, luxury back-office Content & Catalog Management System for **Elinboend Bridal — Exclusive Wedding Gowns & Party Dresses** (`+62 878-8011-1169`).

Modeled after the clean card/grid/modal admin UX of `kembangseladang`, and stripped of all flower-shop & Flash Sale complexity in strict accordance with the **5-Step Algorithm** (`AGENTS.md`).

---

## Core Modules (Strictly 3)

1. **Dashboard (`/`)**
   - **Catalog KPIs**: Active Gowns & Party Dresses, Rental Ready count, Custom Made-to-Measure count, and Published Editorial Articles.
   - **Pricing & Margin Overview**: Average 3-Day Rental Fee, Average Custom Purchase Price, and Average Gross Margin across the collection.
   - **Website & WhatsApp Concierge Analytics**: Daily/Weekly/Monthly storefront traffic and direct WhatsApp fitting inquiries (`+62 878-8011-1169`).
   - **Collection Breakdown**: Visual distribution by **Silhouette** (`Ballgown`, `A-Line`, `Mermaid`, `Sheath / Column`, `Modern Kebaya`) and **Occasion** (`Holy Matrimony`, `Wedding Reception`, `Evening Gala`, `Bridesmaid`, `Engagement / Sangjit`).

2. **Products — Gown & Dress Catalog (`/products`)**
   - **Grid & Table Views** with search, category filter (`Wedding Gown` / `Party Dress`), silhouette filter, occasion filter, and live/hidden status filter.
   - **Bridal Couture Attributes**:
     - Auto-generated SKU (`EB-WG-01`, `EB-PD-01`) & SEO-ready Gown Name builder
     - Silhouette, Occasion, Color Swatch (`color_name` + `color_hex`), Luxury Fabric & Lace Details, Editorial Badge (`New Arrival`, `Best Seller`, `Couture`, `Limited`)
     - Interactive Size Availability toggles (`XS`, `S`, `M`, `L`, `XL`, `Custom`)
   - **Bridal Dual-Pricing & Atelier Cost Matrix**:
     - **3-Day Couture Rental Fee** + Original Rental Price (strikethrough discount) + **Refundable Security Deposit**
     - **Custom Made-to-Measure Purchase Price** + Original Purchase Price (strikethrough discount)
     - **Atelier Production Cost (`cost_price`)** with live Rental Margin % and Purchase Margin % indicators
   - **Google Merchant & Local Boutique Inventory**:
     - `store_code` (`ELINBOEND_ATELIER`), `pickup_sla` (`by_appointment`, `ready_for_fitting`, `made_to_order`), `availability` (`in_stock`, `limited_availability`, `preorder`)
   - **Lookbook Media Gallery**: Multi-image upload, drag-and-drop, and URL addition.

3. **Articles & Blog — Bridal Journal & SEO (`/articles`)**
   - Editorial management for `Bridal Guide`, ` Gown Care`, `Real Weddings`, `Evening Styling`, and `Silhouette Guide`.
   - Split-view **Rich Article Editor** with quick luxury formatting tags and **Real-Time SEO Score Validator** (Title length, Focus Keyword, Meta Description, Word Count, Headings, Image Alt Text, Internal Links).

---

## Quick Start

```powershell
# 1. Install dependencies
npm install

# 2. Run development server (http://localhost:5174)
npm run dev

# 3. Run unit tests
npm test

# 4. Build for production
npm run build
```

## Optional Supabase Connection

Copy `.env.example` to `.env` and fill in your Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) to sync directly with the `Elinboendbridal` database (`products` and `articles` tables). Without `.env`, the admin panel works out of the box using persistent local storage seeded with 8 signature Elinboend Bridal gowns & party dresses and 3 bridal journal articles.
