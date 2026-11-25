# Folioku

Platform pembuat portofolio berbasis template. Admin menyediakan koleksi template dari gaya modern sampai klasik, lalu pengguna atau klien dapat memilih, mengedit, menambah, menghapus bagian, dan mempublikasikan portofolio mereka tanpa perlu menulis kode.

> **Catatan:** "Folioku" adalah nama sementara. Ganti sesuai nama brand kamu.

---

## Daftar Isi

- [Fitur](#fitur)
- [Alur Platform](#alur-platform)
- [Teknologi](#teknologi)
- [Struktur Folder](#struktur-folder)
- [Struktur Data Template](#struktur-data-template)
- [Instalasi](#instalasi)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Peran Pengguna](#peran-pengguna)
- [Roadmap](#roadmap)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Fitur

### Untuk Klien
- Daftar dan login akun
- Galeri template dengan filter gaya (minimalis, klasik, retro, editorial, dan lainnya)
- Editor visual berbasis section:
  - Ubah teks, gambar, warna, dan font
  - Tambah, duplikat, urutkan ulang, dan hapus section
  - Undo dan redo
  - Pratinjau tampilan desktop, tablet, dan HP
- Simpan otomatis
- Dashboard untuk mengelola beberapa proyek portofolio
- Publish ke link publik (saat ini `/p/namaklien`; subdomain `namaklien.folioku.com` menyusul)
- Ekspor ke PDF

### Untuk Admin
- Upload dan kelola template
- Atur kategori dan tag template
- Kelola pengguna dan proyek
- Statistik penggunaan template

---

## Alur Platform

```
Admin upload template
        │
        ▼
Galeri template  ──►  Klien memilih gaya
        │
        ▼
Editor visual    ──►  Edit, geser, hapus elemen
        │
        ▼
Simpan otomatis  ──►  Data JSON di database
        │
        ▼
Publish          ──►  Link portofolio atau PDF
```

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Editor visual | Editor berbasis section buatan sendiri (format JSON di bawah) |
| Drag and drop | dnd-kit |
| State management | Zustand |
| Backend dan database | Supabase (PostgreSQL) |
| Autentikasi | Supabase Auth |
| Penyimpanan gambar | Supabase Storage |
| Ekspor PDF | Playwright atau react-pdf |
| Hosting | Vercel |
| Font | Google Fonts dan Fontshare (gratis untuk komersial) |

---

## Struktur Folder

```
folioku/
├── app/
│   ├── (auth)/              # Halaman masuk dan daftar
│   ├── (dashboard)/         # Dashboard klien
│   ├── editor/[projectId]/  # Halaman editor
│   ├── templates/           # Galeri template
│   ├── p/[slug]/            # Halaman portofolio publik
│   ├── api/upload/          # Unggah gambar
│   ├── api/files/[name]/    # Menyajikan gambar (mode lokal)
│   └── actions.ts           # Server action: akun, proyek, publish
├── components/
│   ├── editor/              # Editor: store Zustand, panel, field
│   ├── sections/            # Section siap pakai (hero, tentang, galeri, kontak, dll.)
│   └── ui/                  # Komponen UI umum
├── lib/
│   ├── backend/             # Penyimpanan: mode lokal dan Supabase
│   ├── renderer/            # Mengubah JSON menjadi halaman
│   ├── sections.ts          # Skema field setiap jenis section
│   └── templates.ts         # Daftar template bawaan
├── supabase/schema.sql      # Tabel, RLS, dan bucket Storage
├── templates/               # File JSON template bawaan
├── public/placeholder/      # Gambar contoh
├── proxy.ts                 # Memperbarui sesi Supabase
└── README.md
```

---

## Struktur Data Template

Setiap template dan proyek disimpan dalam format JSON. Saat klien mengedit, yang berubah hanya datanya, lalu halaman dirender ulang.

```json
{
  "id": "tpl-minimalis-01",
  "name": "Minimalis Modern",
  "category": "modern",
  "theme": {
    "fontHeading": "Plus Jakarta Sans",
    "fontBody": "Inter",
    "colorPrimary": "#111111",
    "colorAccent": "#FF5A36",
    "colorBackground": "#FFFFFF"
  },
  "sections": [
    {
      "id": "sec-1",
      "type": "hero",
      "props": {
        "title": "Halo, saya Nama Kamu",
        "subtitle": "Desainer Grafis",
        "image": "/placeholder/hero.jpg",
        "align": "left"
      }
    },
    {
      "id": "sec-2",
      "type": "gallery",
      "props": {
        "columns": 3,
        "items": []
      }
    }
  ]
}
```

### Tabel Database Utama

| Tabel | Isi |
|---|---|
| `users` | Data akun dan peran (admin atau klien) |
| `templates` | Data JSON template, kategori, thumbnail |
| `projects` | Salinan template milik klien yang sudah diedit |
| `assets` | Gambar yang diunggah klien |
| `publications` | Slug publik dan status publish |

---

## Instalasi

### Prasyarat
- Node.js versi 20 atau lebih baru
- Git
- Akun Supabase (opsional, untuk penggunaan online)

### Coba cepat (mode lokal, tanpa Supabase)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`, daftar akun, lalu pilih template. Tanpa variabel Supabase, aplikasi otomatis memakai **mode lokal**: akun, proyek, dan gambar disimpan di folder `data/` (tidak ikut ke Git). Pengguna pertama yang mendaftar otomatis menjadi admin.

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/username/folioku.git
cd folioku

# 2. Install dependensi
npm install

# 3. Salin file environment
cp .env.example .env.local

# 4. Isi variabel di .env.local (lihat bagian berikut)
#    lalu jalankan supabase/schema.sql di Supabase → SQL Editor

# 5. Jalankan server development
npm run dev
```

Buka `http://localhost:3000` di browser.

---

## Variabel Lingkungan

```env
NEXT_PUBLIC_SUPABASE_URL=url_project_supabase_kamu
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_supabase_kamu
SUPABASE_SERVICE_ROLE_KEY=service_role_key_kamu
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Hanya untuk mode lokal (opsional, dibuat otomatis jika kosong)
SESSION_SECRET=
```

Jika `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` diisi, aplikasi memakai Supabase (Auth, PostgreSQL, Storage bucket `assets`). Jika kosong, aplikasi memakai mode lokal.

Jangan pernah mengunggah `.env.local` ke repository publik.

---

## Peran Pengguna

| Peran | Akses |
|---|---|
| Admin | Mengelola template, kategori, pengguna, dan semua proyek |
| Klien | Memilih template, mengedit, menyimpan, dan mempublikasikan proyek miliknya |
| Pengunjung | Melihat portofolio yang sudah dipublikasikan |

---

## Roadmap

### Tahap 1: MVP
- [x] Login dan daftar
- [x] 5 sampai 10 template awal
- [x] Edit teks, gambar, dan warna
- [x] Tambah dan hapus section
- [x] Simpan otomatis
- [x] Publish ke link publik

### Tahap 2: Pengembangan
- [x] Drag and drop urutan section
- [x] Pratinjau responsif (desktop, tablet, HP)
- [ ] Ekspor PDF
- [ ] Custom domain
- [ ] Panel admin lengkap

### Tahap 3: Skala Bisnis
- [ ] Paket langganan (gratis dan premium)
- [ ] Integrasi pembayaran (Midtrans atau Xendit)
- [ ] Marketplace template dari desainer lain
- [ ] Kolaborasi tim dalam satu proyek
- [ ] Statistik pengunjung portofolio

---

## Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "Menambahkan fitur X"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detailnya.
