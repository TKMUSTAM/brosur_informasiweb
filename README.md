# WEBMUSTAM — Website Yayasan Pendidikan Islam Mustam

Website modern, premium, dan ramah anak untuk Yayasan Pendidikan Islam yang menaungi **TPA, KB, TK A, TK B** serta program **pendidikan dan pembinaan yatim piatu**.

Dibangun dengan **Vite + React + TypeScript + Tailwind CSS v4 + Lucide Icons**.

## Menjalankan

```bash
npm install
npm run dev      # development → http://localhost:5173
npm run build    # produksi → folder dist/
npm run preview  # pratinjau build
```

### Chatbot AI (Pusat Informasi) — wajib untuk jawaban natural

Chatbot bisa menjawab dengan **AI sungguhan (Groq)** melalui server proxy kecil. Tanpa server, chatbot otomatis fallback ke engine kata kunci lokal (tetap berfungsi, tapi jawaban kaku).

```bash
# 1. Siapkan API key (sekali saja)
cp .env.example .env
# lalu isi GROQ_API_KEY dengan key dari https://console.groq.com/keys

# 2. Jalankan server proxy (terminal 1)
npm run server:dev     # API di http://localhost:8787

# 3. Jalankan Vite dev (terminal 2) — proxy /api otomatis ke server
npm run dev
```

**Produksi:** `npm run build && npm run server` → server melayani API + file statis `dist/` di satu port (default 8787).

> 🔒 **Keamanan:** API key hanya dibaca di server (`server/index.mjs`) — tidak pernah terekspos ke browser. `.env` sudah di-`.gitignore`. Jangan commit `.env`.

File penting server: `server/index.mjs` (proxy → Groq), `server/knowledge.mjs` (pengetahuan yayasan untuk AI — edit di sini jika data berubah).

## Struktur Penting

```
src/
├── data/                 ← SEMUA KONTEN (ganti di sini)
│   ├── site.ts           ← nama yayasan, kontak, sosmed, navigasi
│   ├── programs.ts       ← program pendidikan & kurikulum
│   ├── content.ts        ← pilar, doa, artikel, testimoni, struktur, legalitas, fasilitas
│   ├── news.ts           ← berita & kegiatan
│   ├── gallery.ts        ← galeri
│   └── donations.ts      ← donasi, transparansi, data admin
├── components/           ← komponen reusable (Navbar, Footer, cards, forms, ilustrasi)
├── sections/             ← section-section halaman beranda
├── pages/                ← semua halaman (routing di App.tsx)
└── lib/                  ← utilitas (jadwal sholat, hijriyah, format)
```

## Fitur

- **27+ halaman** — Beranda, Profil, Program, Yatim, PPDB, Berita, Galeri, Konten Islami, Doa, Jadwal Sholat, Kontak
- **Jadwal Sholat** — dihitung astronomis berdasarkan lokasi pengguna (geolokasi, fallback Jakarta)
- **Kalender Hijriyah** — otomatis via `Intl` (islamic-umalqura)
- **Form PPDB** — data siswa, data orang tua, upload berkas, nomor pendaftaran otomatis
- **Form Donasi** — nominal pilihan & custom, pilihan program, konfirmasi sukses
- **Chatbot Pusat Informasi** — jawaban natural via AI (Groq API) dengan fallback otomatis ke engine lokal, tombol navigasi akurat, dan knowledge base yayasan
- **Admin Dashboard** — `/admin` dengan sidebar, statistik, chart SVG ringan, tabel PPDB & donasi
- **Ilustrasi 100% offline** — ilustrasi SVG custom (tanpa foto anak asli, privasi aman)
- **Animasi subtle** — fade-up on scroll, floating shapes, hover micro-interactions (IntersectionObserver, tanpa library animasi)
- **SEO** — metadata dinamis per halaman, Open Graph, JSON-LD, sitemap.xml, robots.txt

## Kustomisasi Cepat

1. **Nama & kontak yayasan** → `src/data/site.ts`
2. **Semua konten** (program, berita, galeri, doa, testimoni) → folder `src/data/`
3. **Warna & font** → `src/index.css` (blok `@theme`)
4. **Jadwal sholat default** → `src/lib/prayerTimes.ts` (`DEFAULT_LOCATION` & sudut fajr/isya)

> Data donasi & statistik di halaman ini adalah **placeholder** dan siap dihubungkan ke backend. Cari komentar `// placeholder` di `src/data/`.
