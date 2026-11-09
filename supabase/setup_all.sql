-- ====================================================================
-- Elinboend Bridal — ONE-CLICK COMPLETE DATABASE SETUP (Schema + Seed)
-- Project Ref: atbnjwuuzylbalibqrwo
--
-- Copy this ENTIRE file -> Paste into Supabase SQL Editor -> Click RUN
-- Link: https://supabase.com/dashboard/project/atbnjwuuzylbalibqrwo/sql/new
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. Admin allowlist & helper function
--    By default, any user created in Authentication -> Users has admin access.
--    If you add rows to public.admin_emails, only those emails have admin access.
-- --------------------------------------------------------------------
create table if not exists public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null and (
    not exists (select 1 from public.admin_emails)
    or exists (
      select 1
      from public.admin_emails
      where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------
-- 1. Products (Wedding Gowns & Party Dresses)
-- --------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null default '',
  title text not null,
  slug text not null unique,
  product_type text not null default 'wedding_gown'
    check (product_type in ('wedding_gown', 'party_dress')),
  silhouette text not null default 'Ballgown',
  occasion text not null default 'Holy Matrimony',
  color_name text not null default 'Ivory',
  color_hex text not null default '#F5EDE6',
  fabric text not null default '',
  description text not null default '',

  rental_price bigint not null default 0,
  original_rental_price bigint,
  purchase_price bigint not null default 0,
  original_purchase_price bigint,
  security_deposit bigint not null default 0,
  is_rental_available boolean not null default true,
  is_purchase_available boolean not null default true,

  badge_label text not null default '',
  sizes_available text[] not null default array['XS', 'S', 'M', 'L', 'Custom'],
  images text[] not null default '{}',

  rating numeric(2, 1) not null default 5.0,
  reviews_count integer not null default 0,
  rented_count integer not null default 0,

  is_live boolean not null default true,
  store_code text not null default 'EB_ATELIER',
  pickup_sla text not null default '3_day',
  in_stock boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_live_created_idx
  on public.products (is_live, created_at desc);

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- --------------------------------------------------------------------
-- 2. Articles (Bridal Journal)
-- --------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  meta_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  excerpt text,
  content text not null default '',
  cover_image text,
  cover_image_alt text,
  category text not null default 'Silhouette Guide',
  tags text[] not null default '{}',
  author_name text not null default 'Elin Boend, Lead Designer',
  reading_time_minutes integer not null default 4,
  related_product_ids text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  views_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx
  on public.articles (status, published_at desc);

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

-- --------------------------------------------------------------------
-- 3. Realtime publication (auto-updates www.elinboendbridal.com when Admin saves)
-- --------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    execute 'create publication supabase_realtime';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'products'
  ) then
    execute 'alter publication supabase_realtime add table public.products';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'articles'
  ) then
    execute 'alter publication supabase_realtime add table public.articles';
  end if;
end;
$$;

-- --------------------------------------------------------------------
-- 4. Row Level Security (RLS)
-- --------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.articles enable row level security;

drop policy if exists "Public read live products" on public.products;
create policy "Public read live products"
  on public.products for select
  using (is_live = true or public.is_admin());

drop policy if exists "Admin insert products" on public.products;
create policy "Admin insert products"
  on public.products for insert
  with check (public.is_admin());

drop policy if exists "Admin update products" on public.products;
create policy "Admin update products"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin delete products" on public.products;
create policy "Admin delete products"
  on public.products for delete
  using (public.is_admin());

drop policy if exists "Public read published articles" on public.articles;
create policy "Public read published articles"
  on public.articles for select
  using (status = 'published' or public.is_admin());

drop policy if exists "Admin insert articles" on public.articles;
create policy "Admin insert articles"
  on public.articles for insert
  with check (public.is_admin());

drop policy if exists "Admin update articles" on public.articles;
create policy "Admin update articles"
  on public.articles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin delete articles" on public.articles;
create policy "Admin delete articles"
  on public.articles for delete
  using (public.is_admin());

-- --------------------------------------------------------------------
-- 5. Media Storage Bucket (gown photos & article covers)
-- --------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- --------------------------------------------------------------------
-- 6. Initial Catalog Seed (8 Bridal Gowns/Dresses + 3 Journal Articles)
-- --------------------------------------------------------------------
insert into public.products (
  id, code, title, slug, product_type, silhouette, occasion,
  color_name, color_hex, fabric, description,
  rental_price, original_rental_price, purchase_price, original_purchase_price,
  security_deposit, is_rental_available, is_purchase_available,
  badge_label, sizes_available, images,
  rating, reviews_count, rented_count,
  is_live, store_code, pickup_sla, in_stock, created_at
) values
('2c0f595e-1ccd-4b4b-b2a5-6407e6b216e2', 'EB-001', 'The Aurelia French Lace Ballgown', 'the-aurelia-french-lace-ballgown', 'wedding_gown', 'Ballgown', 'Holy Matrimony', 'Ivory & Warm Champagne', '#F5EDE6', 'French Chantilly Lace & Silk Organza', 'Handcrafted with delicate French Chantilly lace over sparkling organza, The Aurelia features an internal sweetheart corset and a cathedral train that floats down the aisle.', 6500000, 8500000, 24000000, 28000000, 1500000, true, true, 'Best Seller', array['XS', 'S', 'M', 'Custom']::text[], array['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80']::text[], 5, 18, 14, true, 'EB_ATELIER', '3_day', true, '2026-10-15T08:00:00Z'),
('abc3fc6e-ed8e-4783-88c2-0f6b0110ba8a', 'EB-002', 'Seraphina Crystalline Mermaid Gown', 'seraphina-crystalline-mermaid-gown', 'wedding_gown', 'Mermaid', 'Wedding Reception', 'Pure White', '#FFFFFF', 'Crepe Silk & Swarovski Beads', 'A sculptural masterpiece hugging every curve before cascading into a flared godet train encrusted with hand-sewn micro crystals.', 5200000, 6500000, 19500000, 22000000, 1200000, true, true, 'Haute Couture', array['S', 'M', 'L']::text[], array['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80']::text[], 4.9, 14, 11, true, 'EB_ATELIER', '3_day', true, '2026-10-18T09:00:00Z'),
('a77109ee-fdd9-4744-874f-a9ec1db24bd4', 'EB-003', 'Elysian Minimalist Mikado Sheath', 'elysian-minimalist-mikado-sheath', 'wedding_gown', 'Sheath / Column', 'Holy Matrimony', 'Lustrous Pearl', '#FAF8F5', 'Heavy Japanese Mikado Silk', 'For the contemporary bride who values clean lines and architectural drapery. Includes a detachable dramatic back bow with floor-sweeping ties.', 4200000, 5000000, 15500000, 18000000, 1000000, true, true, 'Modern Bride', array['XS', 'S', 'M', 'L', 'Custom']::text[], array['https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80']::text[], 4.8, 9, 8, true, 'EB_ATELIER', '2_day', true, '2026-10-20T10:30:00Z'),
('5e7ba0ad-f5ab-4bcb-93b5-a1090bbb2a67', 'EB-004', 'Nocturne Emerald Velvet Evening Gown', 'nocturne-emerald-velvet-evening-gown', 'party_dress', 'Mermaid', 'Evening Gala', 'Deep Emerald', '#0A3B2A', 'Silk Stretch Velvet & Gold Thread', 'Luxurious deep emerald stretch velvet featuring an asymmetric off-shoulder neckline and a sensual high leg slit. Perfect for galas and black-tie affairs.', 2800000, 3500000, 9800000, 12000000, 800000, true, true, 'Party Exclusive', array['S', 'M', 'L']::text[], array['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80']::text[], 4.9, 22, 19, true, 'EB_ATELIER', 'same_day', true, '2026-10-22T11:15:00Z'),
('49db80c8-5432-4afd-860f-b74465012490', 'EB-005', 'Celeste Starlight A-Line Gown', 'celeste-starlight-a-line-gown', 'wedding_gown', 'A-Line', 'Wedding Reception', 'Blush & Silver Shimmer', '#FCEEE9', 'Glitter Tulle & 3D Floral Appliques', 'Soft blush undertones overlaid with celestial star-dusted tulle and botanical 3D blossoms trickling down from bodice to hem.', 5800000, 7200000, 21000000, 25000000, 1500000, true, true, 'Trending', array['XS', 'S', 'M', 'XL', 'Custom']::text[], array['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80']::text[], 5, 31, 24, true, 'EB_ATELIER', '3_day', true, '2026-10-25T14:00:00Z'),
('2ae01e0e-99ff-4696-a4f2-4df09c6d61f6', 'EB-006', 'Genevieve Champagne Draped Satin Dress', 'genevieve-champagne-draped-satin-dress', 'party_dress', 'Sheath / Column', 'Evening Gala', 'Warm Champagne', '#DFCCAF', 'Heavy Duchess Satin', 'Impeccably draped cowl neckline with open back detailing, tailored to move like liquid gold under evening lights.', 2400000, 3000000, 8500000, 10500000, 700000, true, true, 'Popular Rental', array['S', 'M']::text[], array['https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80']::text[], 4.7, 11, 15, true, 'EB_ATELIER', 'same_day', true, '2026-10-27T15:30:00Z'),
('0fcf2502-375e-46d6-8434-1847e0f7fa15', 'EB-007', 'Adelaide Modern Heritage Kebaya Pengantin', 'adelaide-modern-heritage-kebaya-pengantin', 'wedding_gown', 'Modern Kebaya', 'Holy Matrimony', 'Broken White & Gold Lace', '#F9F6F0', 'French Corded Lace & Songket Accent', 'A refined fusion of traditional Indonesian kebaya silhouette with contemporary haute couture corsetry and floor-length trailing lace train.', 4900000, 6000000, 18000000, null, 1200000, true, true, 'Heritage Couture', array['S', 'M', 'Custom']::text[], array['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80']::text[], 5, 27, 21, true, 'EB_ATELIER', '3_day', true, '2026-10-29T16:00:00Z'),
('05853fdd-840a-4d5c-9ba4-38e557f16c2d', 'EB-008', 'Rosalind Pastel Rose Bridesmaid Gown', 'rosalind-pastel-rose-bridesmaid-gown', 'party_dress', 'A-Line', 'Bridesmaid', 'Dusty Rose', '#E2B2B8', 'Italian Chiffon & Pleated Bodice', 'Airy and romantic, Rosalind is designed for bridesmaids who desire elegance with effortless comfort throughout a full wedding celebration.', 1800000, 2200000, 5500000, null, 500000, true, true, 'Bridesmaid Favorite', array['XS', 'S', 'M', 'L', 'XL']::text[], array['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80']::text[], 4.8, 19, 17, true, 'EB_ATELIER', 'next_day', true, '2026-11-01T10:00:00Z')
on conflict (slug) do nothing;

insert into public.articles (
  title, slug, meta_title, meta_description, focus_keyword, canonical_url,
  excerpt, content, cover_image, cover_image_alt, category, tags,
  author_name, reading_time_minutes, related_product_ids, status, views_count,
  published_at, created_at
) values
('The Ultimate Guide to Choosing Your Dream Wedding Gown Silhouette', 'ultimate-guide-choosing-wedding-gown-silhouette', 'Ultimate Guide to Choosing Your Wedding Gown Silhouette | Elinboend', 'Discover how wedding gown silhouettes—from French lace ballgowns to sculptural mermaid dresses—complement your natural proportions for your big day.', 'wedding gown silhouette', 'https://elinboendbridal.com/articles/ultimate-guide-choosing-wedding-gown-silhouette', 'From grand ballgowns to architectural column sheaths, learn how neckline, train, and corset geometry complement your unique body proportions.', '# The Ultimate Guide to Choosing Your Dream Wedding Gown Silhouette

Every bride arrives at our atelier with a vision. Yet, discovering the **wedding gown silhouette** that truly takes your breath away is often a journey of exploring how fabric architecture interacts with your body geometry.

---

## 1. The Timeless Ballgown
If you have envisioned a fairytale grand entrance under chandelier lighting, the ballgown remains unrivaled. Featuring a structured bodice that cinches at the natural waist before dramatically cascading into layers of French Chantilly lace and silk organza, this silhouette creates the classic hourglass proportion.

> **Stylist Note:** Pair a cathedral-length ballgown with an internal corset for effortless posture throughout your ceremony and reception.

---

## 2. The Universally Flattering A-Line
The A-line is celebrated as bridal couture''s most versatile silhouette. Gently widening from the bust downwards without dramatic volume at the hips, it offers supreme comfort for long ceremony rituals and garden receptions.

---

## 3. The Sculptural Mermaid & Trumpet
Designed for confident brides who wish to accentuate their natural curves. A well-constructed mermaid wedding gown hugs the torso, waist, and hips before flaring outward at the mid-thigh or knee. Our atelier integrates flexible French boning to ensure full ease of movement during your first dance.

---

## 4. The Modern Minimalist Sheath
For intimate celebrations or holy matrimony ceremonies, heavy layers can feel overwhelming. Fluid Japanese Mikado silk or bias-cut satin sheaths offer clean, sculptural elegance that moves like water.

---

### Book Your Private 1-on-1 Atelier Fitting
Ready to try on these silhouettes in person? Schedule your private fitting session with our bridal concierge today.

[Book Private Fitting via WhatsApp](https://wa.me/6287880111169?text=Hello%20Elinboend%20Bridal%2C%20I%20would%20like%20to%20schedule%20a%20private%20gown%20fitting%20session)', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', 'Luxury wedding gown silhouette fitting at Elinboend Bridal Atelier', 'Silhouette Guide', array['wedding gown silhouette', 'ballgown', 'mermaid gown', 'a-line dress', 'bridal fitting']::text[], 'Elin Boend, Lead Designer', 5, array['2c0f595e-1ccd-4b4b-b2a5-6407e6b216e2', 'abc3fc6e-ed8e-4783-88c2-0f6b0110ba8a', 'a77109ee-fdd9-4744-874f-a9ec1db24bd4']::text[], 'published', 428, '2026-10-28T08:00:00Z', '2026-10-28T08:00:00Z'),
('Wedding Gown Rental vs. Custom Made: Which One Fits Your Wedding Budget?', 'wedding-gown-rental-vs-custom-made-budget-guide', 'Wedding Gown Rental vs Custom Made Budget Guide | Elinboend Bridal', 'Compare 3-day luxury wedding gown rental vs bespoke custom made-to-measure tailoring at Elinboend Bridal to maximize your wedding budget.', 'wedding gown rental', 'https://elinboendbridal.com/articles/wedding-gown-rental-vs-custom-made-budget-guide', 'Compare the benefits of couture rental with bespoke purchase to maximize your wedding budget without sacrificing luxury craftsmanship.', '# Wedding Gown Rental vs. Custom Made: Which One Fits Your Wedding Budget?

One of the first questions brides ask during our private consultations is whether they should opt for a **wedding gown rental** or commission a bespoke made-to-measure piece.

---

## The Advantages of 3-Day Couture Rental
- **Significant Cost Savings**: Luxury designer gowns with retail values exceeding Rp 24.000.000 can be rented for Rp 4.200.000 – Rp 6.500.000 for a full 3-day window.
- **Zero Preservation Hassle**: You avoid the burden of specialist couture dry cleaning, acid-free storage boxes, and long-term humidity protection.
- **Complimentary Custom Fitting**: At Elinboend Bridal, every rental gown includes temporary waist and hem adjustments plus a fully refundable security deposit.

---

## When to Choose Custom Made-to-Measure
- **Bespoke Proportions**: Ideal when your vision calls for a custom corset cut, specific neckline depth, or detachable train.
- **Heirloom Sentiment**: If you intend to treasure your gown for future generations.
- **Signature Embroidery**: Custom Swarovski beadwork, monogrammed veil lace, or heritage Songket accents.

[Consult With Our Bridal Stylist](https://wa.me/6287880111169?text=Hello%20Elinboend%20Bridal%2C%20I%20want%20to%20ask%20about%20Rental%20vs%20Custom%20Made%20Gowns)', 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80', 'Couture wedding gown rental and custom tailoring comparison', 'Bridal Budget', array['wedding gown rental', 'custom wedding dress', 'bridal budget', 'sewa gaun pengantin']::text[], 'Clarissa Ward, Bridal Concierge', 4, array['2c0f595e-1ccd-4b4b-b2a5-6407e6b216e2', '49db80c8-5432-4afd-860f-b74465012490', '0fcf2502-375e-46d6-8434-1847e0f7fa15']::text[], 'published', 315, '2026-10-15T09:00:00Z', '2026-10-15T09:00:00Z'),
('Bridal Fitting Etiquette: 5 Essentials to Prepare Before Your Fitting Session', 'bridal-fitting-etiquette-5-essentials-to-prepare', 'Bridal Fitting Etiquette: 5 Essentials Before Your Gown Fitting', 'Maximize your 1-on-1 bridal fitting session at Elinboend Bridal with these 5 essential tips: shoe heel height, seamless undergarments, and styling prep.', 'bridal fitting etiquette', 'https://elinboendbridal.com/articles/bridal-fitting-etiquette-5-essentials-to-prepare', 'Maximize your 1-on-1 atelier fitting session with these essential preparations: undergarment selection, heel height, and guest etiquette.', '# Bridal Fitting Etiquette: 5 Essentials to Prepare Before Your Fitting Session

Your private fitting is an intimate milestone where sketches and silhouettes transform into reality. Mastering **bridal fitting etiquette** ensures your 90-minute appointment is calm, productive, and joyful.

---

## 1. Bring Your Wedding Shoes or Exact Heel Height
The hemline alteration depends entirely on your heel height. Even a 2 cm variance can cause a cathedral train or mermaid flare to bunch on the floor.

## 2. Wear Seamless Nude Undergarments
Bright or textured undergarments distract from sheer illusion lace and delicate French Chantilly bodices.

## 3. Curate an Intimate Entourage (2 Trusted Guests)
Too many conflicting opinions create unnecessary stress. Bring one or two loved ones whose aesthetic judgment and emotional support anchor you.

## 4. Test Movement: Walk, Sit, and Dance
A couture gown should not only photograph beautifully—it should allow you to breathe, embrace guests, and dance comfortably.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', 'Private bridal fitting session at Elinboend Bridal boutique', 'Fitting & Care', array['bridal fitting etiquette', 'gown fitting tips', 'wedding shoes', 'atelier appointment']::text[], 'Elin Boend, Lead Designer', 4, array['abc3fc6e-ed8e-4783-88c2-0f6b0110ba8a', '5e7ba0ad-f5ab-4bcb-93b5-a1090bbb2a67']::text[], 'published', 264, '2026-09-30T10:00:00Z', '2026-09-30T10:00:00Z')
on conflict (slug) do nothing;
