# Setup & Panduan Sinkronisasi Database Server (Supabase Free Tier)

Panduan ini menghubungkan data antara:
1. **Admin Panel**: `https://admin.elinboendbridal.com/` (`d:\01_Projects\elinboendbridaladmin`)
2. **Main Storefront**: `https://www.elinboendbridal.com/` (`D:\01_Projects\Elinboendbridal`)

Keduanya menggunakan **1 database server PostgreSQL bersama di Supabase (100% Free Tier)** sehingga setiap kali admin menambah/mengedit/menghapus produk atau artikel di Admin Panel, data di website utama langsung otomatis tersinkronisasi secara real-time.

---

## 1. Buat Proyek Supabase (Gratis)
1. Buka [https://supabase.com](https://supabase.com) dan login/daftar (bisa pakai GitHub).
2. Klik **New project**.
3. Isi formulir:
   - **Name**: `elinboend-bridal`
   - **Database Password**: buat password yang aman dan simpan.
   - **Region**: Pilih **Singapore (`ap-southeast-1`)** agar akses dari Indonesia super cepat.
   - **Pricing Plan**: **Free**.
4. Klik **Create new project** dan tunggu ~1-2 menit hingga status database aktif.

---

## 2. Salin Kredensial API
1. Di dashboard Supabase, buka menu **Project Settings** (ikon gerigi di kiri bawah) → **API**.
2. Salin 2 nilai berikut:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **anon / public key** (kunci panjang di bagian *Project API keys*)

---

## 3. Jalankan Database Schema & Initial Data
Di dashboard Supabase, buka menu **SQL Editor** (ikon terminal/SQL di menu kiri):

### Langkah 3A: Jalankan Schema
1. Klik **New query**.
2. Buka file [`d:\01_Projects\elinboendbridaladmin\supabase\schema.sql`](file:///d:/01_Projects/elinboendbridaladmin/supabase/schema.sql).
3. Salin seluruh isinya, tempel ke SQL Editor Supabase, lalu klik **Run** (tombol hijau).
   > *Ini akan membuat tabel `products`, `articles`, `admin_emails`, fungsi keamanan `is_admin()`, Row Level Security (RLS), dan bucket storage `media` untuk upload foto gaun.*

### Langkah 3B: Daftarkan Email Admin Anda
Jalankan query singkat berikut di SQL Editor (ganti dengan email admin Anda):
```sql
insert into public.admin_emails (email)
values ('admin@elinboendbridal.com')
on conflict do nothing;
```

### Langkah 3C: Jalankan Initial Data Seed (Opsional tapi Direkomendasikan)
1. Klik **New query** baru.
2. Buka file [`d:\01_Projects\elinboendbridaladmin\supabase\seed.sql`](file:///d:/01_Projects/elinboendbridaladmin/supabase/seed.sql).
3. Salin seluruh isinya, tempel ke SQL Editor Supabase, lalu klik **Run**.
   > *Database Anda sekarang langsung terisi 8 gaun/dress couture awal dan 3 artikel bridal journal.*

---

## 4. Buat Akun Login Admin di Supabase Auth
1. Di menu kiri Supabase, klik **Authentication** → **Users**.
2. Klik **Add user** → **Create user**.
3. Masukkan:
   - **Email**: sama persis dengan yang Anda daftarkan di Langkah 3B (misal `admin@elinboendbridal.com`).
   - **Password**: masukkan password admin Anda.
   - **Auto Confirm User**: centang `Yes` (agar bisa langsung login tanpa perlu verifikasi email).
4. Klik **Create user**.

---

## 5. Hubungkan ke Vercel (Produksi)
Agar website live langsung terhubung ke database server:

### A. Untuk Admin Panel (`admin.elinboendbridal.com`)
1. Buka dashboard Vercel → pilih project **`elindboendadmin`**.
2. Buka **Settings** → **Environment Variables**.
3. Tambahkan 2 variabel:
   - `VITE_SUPABASE_URL` = *[Project URL Supabase Anda]*
   - `VITE_SUPABASE_ANON_KEY` = *[anon key Supabase Anda]*
4. Pergi ke tab **Deployments** → klik titik tiga `...` pada deployment terbaru → pilih **Redeploy**.

### B. Untuk Storefront Website (`www.elinboendbridal.com`)
1. Buka dashboard Vercel → pilih project website utama Elinboend Bridal.
2. Buka **Settings** → **Environment Variables**.
3. Tambahkan 2 variabel yang sama:
   - `VITE_SUPABASE_URL` = *[Project URL Supabase Anda]*
   - `VITE_SUPABASE_ANON_KEY` = *[anon key Supabase Anda]*
4. Lakukan **Redeploy**.

---

## 6. Pengujian Lokal (.env)
Jika ingin menjalankan secara lokal di komputer:
1. Buat file `.env` di folder `d:\01_Projects\elinboendbridaladmin\.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_WHATSAPP_CONCIERGE=6287880111169
   ```
2. Buat file `.env` di folder `D:\01_Projects\Elinboendbridal\.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_WHATSAPP_CONCIERGE=6287880111169
   ```
3. Jalankan `npm run dev` pada kedua project. Data produk dan artikel kini 100% tersimpan di server Supabase dan tersinkronisasi!
