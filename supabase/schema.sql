-- ====================================================================
-- Elinboend Bridal — Shared Supabase Schema (Products & Articles)
-- Used by BOTH apps:
--   • admin.elinboendbridal.com  (read + write, admin only)
--   • www.elinboendbridal.com    (public read: live products, published articles)
--
-- Run this whole file once in: Supabase Dashboard → SQL Editor → New query → Run.
-- It is idempotent (safe to re-run).
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. Admin allowlist
--    Only emails listed here can write data or upload media.
--    Add your admin email after running this file (see step at the bottom).
-- --------------------------------------------------------------------
create table if not exists public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;
-- No policies on purpose: the table is invisible to anon/authenticated clients.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Shared trigger to keep updated_at fresh
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
--    Prices are whole Rupiah stored as bigint.
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
-- 3. Row Level Security
--    Public (storefront): read live products & published articles only.
--    Admin (allowlisted email): full read/write.
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
-- 4. Media Storage (gown photos & article covers)
--    Public bucket for reading; only admins can upload / replace / delete.
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
-- 5. FINAL STEP — allowlist your admin login email (edit, then run):
--
--   insert into public.admin_emails (email)
--   values ('admin@elinboendbridal.com')
--   on conflict do nothing;
-- --------------------------------------------------------------------

