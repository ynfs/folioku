# Safantara

Platform pembuat **portofolio/company profile** dan **undangan digital** berbasis template. Admin menyediakan koleksi template dari gaya modern sampai klasik, lalu pengguna atau klien dapat memilih, mengedit, menambah, menghapus bagian, dan mempublikasikan portofolio mereka tanpa perlu menulis kode.

> Beranda punya dua tab produk: **Portofolio & Company Profile** dan **Undangan Digital**. Keduanya memakai editor, template, multi-halaman, dan Desain Bebas yang sama.

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
- Publish ke link publik (saat ini `/p/namaklien`; subdomain `namaklien.safantara.com` menyusul)
- Ekspor ke PDF

### Undangan Digital
Untuk pernikahan, pernikahan adat, ulang tahun, khitanan/aqiqah, dan acara/event. 10 template bawaan.
- **Pernikahan adat**: Jawa, Sunda, Minangkabau, Bali, Batak — tiap tema punya warna, ornamen SVG (kawung, mega mendung, songket, jepun, gorga), sapaan, dan susunan prosesi sendiri
- **Pawiwahan Adat Jawa Klasik**: gunungan (kayon) SVG original, latar sogan berbingkai emas, tagline & nama mempelai dalam **Aksara Jawa** (Unicode, font Noto Sans Javanese)
- **Pengubah Latin → Aksara Jawa** di editor (field aksara & teks Desain Bebas): sandhangan wulu/suku/pepet/taling, layar/cecak/wignyan, pangkon, pasangan, cakra, pengkal — hasil tetap perlu dicek untuk aksara murda/rekan
- **Prosesi Adat**: linimasa rangkaian upacara (nama, makna, waktu, tempat) — sesuaikan dengan tradisi keluarga
- **Dress Code**: anjuran busana dengan contoh warna
- **Ornamen pemisah judul** bisa dipilih di panel Tema atau diunggah sendiri
- **Sampul** dengan nama tamu otomatis dari link: `/p/nama-undangan?to=Budi` → "Kepada Yth. Budi". Teks `{{tamu}}` di bagian mana pun juga diganti nama tamu
- **Mempelai**, **Acara** (tanggal, jam, zona WIB/WITA/WIT, peta, simpan ke Google Calendar), **Hitung mundur**, **Kisah**, **Galeri**
- **RSVP & ucapan**: tamu mengisi kehadiran, jumlah orang, dan ucapan; ucapan tampil di undangan
- **Amplop digital**: rekening/e-wallet dengan tombol salin dan QR opsional
- **Musik latar** (mp3, maks. 10 MB) diputar saat tamu menekan "Buka Undangan"
- Dashboard **Tamu & RSVP**: ringkasan kehadiran, tabel RSVP + unduh CSV, pembuat link per tamu, salin pesan, dan kirim lewat WhatsApp
- Formulir RSVP dilindungi kolom jebakan bot dan batas kiriman per IP

### Koleksi Retro Klasik
Gaya vintage 60-an/70-an untuk semua jenis (filter **✦ Retro Klasik** di galeri):
- Undangan: Pernikahan Retro 70-an, Pesta Ulang Tahun Disko, Tasyakuran Retro Klasik, Reuni & Acara Retro
- Portofolio: Company Profile Retro Klasik (kertas kraft & cap), Studio Foto Retro (film strip)
- Aset SVG original: sunburst, lengkung pelangi, gelombang disko, jendela lengkung, poster halftone, kraft, film strip — dengan tekstur grain
- Font retro: Fraunces, Shrikhand, Righteous, Abril Fatface; ornamen pemisah retro (bintang, gelombang, matahari)
- Sampul undangan punya pilihan **nada** gelap/terang agar teks tetap terbaca di latar terang

### Desain Bebas (ala Figma)
Bagian **Desain Bebas** adalah kanvas tempat elemen bisa ditaruh di mana saja:
- Elemen: teks, gambar, bentuk, tombol (tambah lewat toolbar hitam di atas kanvas)
- Geser, ubah ukuran (8 pegangan, Shift = jaga proporsi), putar (Shift = per 15°)
- Garis bantu snap ke tepi/tengah frame dan elemen lain (tahan Alt untuk mematikan)
- Seleksi banyak (Shift+klik) dan seleksi kotak (seret area kosong)
- Klik ganda teks untuk mengetik langsung
- Panel layer: urutan, sembunyikan, kunci, ganti nama
- Panel properti: posisi X/Y/W/H, rotasi, opasitas, font, ukuran, ketebalan, spasi, perataan, warna, sudut, garis, link
- Warna bisa memakai **warna tema** (ikut berubah saat palet diganti) atau warna bebas
- Pintasan: Ctrl+Z/Shift+Z, Ctrl+C/V/X/D, Delete, panah (Shift = 10px), [ ] dan Ctrl+[ ] untuk urutan layer, Ctrl+A, Esc

Frame memakai lebar desain 1200px dan mengecil proporsional di layar yang lebih sempit.

### Multi-halaman
- Panel **Halaman** di kiri atas editor: tambah, ganti nama, ubah alamat, hapus halaman
- Setiap tombol bisa diarahkan ke URL, Beranda, halaman lain, atau **"+ Buat halaman baru"** langsung dari pilihan link tombol
- Tombol juga bisa diarahkan ke **bagian tertentu** (mis. Kontak atau Galeri). Daftar bagian di setiap halaman dideteksi otomatis; saat ditekan, halaman menggulir ke bagian itu, termasuk bagian di halaman lain
- Ctrl+klik tombol di pratinjau untuk menuju halaman atau bagian tujuannya
- Halaman publik tampil di `/p/nama-portofolio/nama-halaman`
- Link disimpan sebagai `page:<id>` atau `section:<id>`, jadi tetap benar walau alamat halaman diganti atau bagian dipindah

### Untuk Admin
- **Pembuat template** di `/admin`: mulai dari kanvas kosong, salin template yang ada, atau jadikan proyek sebagai template
- Edit template dengan editor yang sama (termasuk Desain Bebas), atur nama, kategori, deskripsi, tag
- Terbitkan ke galeri atau simpan sebagai draf
- Upload dan kelola template
- Atur kategori dan tag template
- Kelola pengguna dan proyek
- Statistik penggunaan template

---

## Klasifikasi Template

Total **123 template bawaan** (23 rancangan khusus + 100 dari generator `scripts/generate-koleksi.mjs`), diklasifikasikan dalam tiga tingkat:

1. **Jenis** — Undangan Digital atau Portofolio & Company Profile
2. **Kategori** — jenis acara (undangan) atau bidang usaha/profesi (portofolio)
3. **Gaya** — tampilan visual, berlaku untuk kedua jenis

Galeri (`/templates`) punya filter kategori dan gaya beserta jumlahnya, pencarian, dan halaman bernomor (24 per halaman).

### Undangan Digital (74)
| Kategori | Baru | Total |
|---|---|---|
| Pernikahan | 16 | 19 |
| Pernikahan Adat | 4 | 9 |
| Lamaran & Tunangan | 6 | 6 |
| Ulang Tahun | 8 | 10 |
| Khitanan & Aqiqah | 6 | 8 |
| Wisuda | 5 | 5 |
| Syukuran & Pengajian | 6 | 6 |
| Acara & Event | 6 | 8 |
| Grand Opening | 3 | 3 |

### Portofolio & Company Profile (49)
| Kategori | Baru | Total |
|---|---|---|
| Personal & Kreatif | 6 | 9 |
| Fotografer | 4 | 6 |
| Teknologi & Developer | 5 | 6 |
| Penulis & Pembicara | 3 | 4 |
| Arsitek & Interior | 3 | 4 |
| Bisnis & UMKM | 6 | 6 |
| Kuliner & Kafe | 4 | 5 |
| Kesehatan & Kecantikan | 3 | 3 |
| Pendidikan & Les | 3 | 3 |
| Seni & Musik | 3 | 3 |

### Gaya
| Gaya | Baru | Total |
|---|---|---|
| Minimalis | 14 | 15 |
| Modern | 13 | 13 |
| Elegan | 7 | 8 |
| Klasik | 9 | 10 |
| Retro | 6 | 13 |
| Rustic | 7 | 8 |
| Floral | 5 | 5 |
| Islami | 3 | 4 |
| Nusantara | 4 | 9 |
| Ceria | 7 | 8 |
| Gelap | 9 | 11 |
| Pastel | 8 | 9 |
| Editorial | 6 | 7 |
| Kreatif | 2 | 3 |

Untuk menambah atau mengubah koleksi: edit palet, motif, dan resep di `scripts/generate-koleksi.mjs`, lalu jalankan `node scripts/generate-koleksi.mjs`.

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
safantara/
├── app/
│   ├── (auth)/              # Halaman masuk dan daftar
│   ├── (dashboard)/         # Dashboard klien
│   ├── editor/[projectId]/  # Halaman editor
│   ├── templates/           # Galeri template
│   ├── p/[slug]/            # Portofolio publik (beranda)
│   ├── p/[slug]/[page]/     # Halaman tambahan portofolio publik
│   ├── admin/               # Panel admin & pembuat template
│   ├── api/upload/          # Unggah gambar & lagu mp3
│   ├── api/rsvp/            # RSVP & ucapan tamu undangan
│   ├── (dashboard)/dashboard/undangan/[id]/  # Tamu & RSVP
│   ├── api/files/[name]/    # Menyajikan gambar (mode lokal)
│   └── actions.ts           # Server action: akun, proyek, publish
├── components/
│   ├── editor/              # Editor: store Zustand, panel, kanvas ala Figma
│   ├── sections/            # Section siap pakai (hero, tentang, galeri, kontak, dll.)
│   └── ui/                  # Komponen UI umum
├── lib/
│   ├── backend/             # Penyimpanan: mode lokal dan Supabase
│   ├── renderer/            # Mengubah JSON menjadi halaman
│   ├── sections.ts          # Skema field setiap jenis section
│   ├── canvas.ts            # Utilitas Desain Bebas (elemen, warna tema)
│   ├── pages.ts             # Multi-halaman dan link antarhalaman
│   └── templates.ts         # Daftar template bawaan
├── supabase/schema.sql      # Tabel, RLS, dan bucket Storage
├── templates/               # File JSON template bawaan (+ koleksi-100.json)
├── scripts/generate-koleksi.mjs  # Generator 100 template & gambar sampulnya
├── public/koleksi/          # Gambar sampul koleksi (SVG)
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
git clone https://github.com/username/safantara.git
cd safantara

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
- [x] Pembuat template dan editor Desain Bebas (ala Figma)
- [x] Multi-halaman: tombol membuka halaman lain
- [x] Undangan digital: nama tamu, RSVP, amplop digital, musik, link per tamu
- [ ] Panel admin lengkap (kelola pengguna)
- [ ] Tata letak khusus HP untuk Desain Bebas

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
