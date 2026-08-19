// ============================================================
// IDENTITAS & DATA UTAMA YAYASAN & TK ISLAM AL-MUSTAM
// ============================================================

export const site = {
  name: 'Yayasan & TK Islam Al-Mustam',
  shortName: 'TK Islam Al-Mustam',
  legalName: 'Yayasan Pendidikan Islam Al-Mustam',
  tagline: 'Membentuk Generasi Qur’ani, Beradab, & Cerdas Holistik',
  description:
    'Lembaga Pendidikan Islam Terakreditasi A yang menaungi Playgroup (KB), TK A, TK B, TPA Tahfidz, serta program pembinaan beasiswa penuh bagi santri yatim dan dhuafa.',
  accreditation: 'Terakreditasi A (Unggul)',
  npsn: '69876543',
  skKemenkumham: 'AHU-0012345.AH.01.04.Tahun 2016',
  izinOperasional: '421.1/1234-Disdik/2018',
  foundedYear: 2016,

  contact: {
    address: 'Jl. Pendidikan Islam No. 17, Kel. Melati Putih, Kota Nusantara',
    addressShort: 'Jl. Pendidikan Islam No. 17, Kota Nusantara',
    phone: '+62 21 8765 4321',
    whatsapp: '6281234567890',
    whatsappDisplay: '0812-3456-7890',
    email: 'info@yayasanmustam.id',
    emailAdm: 'ppdb@yayasanmustam.id',
  },

  hours: 'Senin – Jumat: 07.15 – 15.00 WIB',
  schoolHours: '07.15 – 11.30 WIB (KB, TK A, TK B)',

  social: {
    instagram: 'https://instagram.com/yayasanmustam',
    facebook: 'https://facebook.com/yayasanmustam',
    youtube: 'https://youtube.com/@yayasanmustam',
  },

  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28318783422!2d106.759478!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e800000001%3A0x123456789abcdef!2sJakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  mapsLink: 'https://maps.google.com/?q=Yayasan+Pendidikan+Islam+Al-Mustam',
}

// ============================================================
// STRUKTUR NAVIGASI UTAMA (BERKELAS & TIDAK MENUMPUK)
// ============================================================

export type NavChild = {
  label: string
  href: string
  desc?: string
  badge?: string
}

export type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil',
    href: '/profil',
    children: [
      { label: 'Tentang Yayasan & TK', href: '/profil', desc: 'Profil lengkap, nilai keislaman & komitmen mutu' },
      { label: 'Visi, Misi & 7 Pilar Karakter', href: '/visi-misi', desc: 'Arah perjuangan & pembentukan akhlaqul karimah' },
      { label: 'Sejarah Perjalanan', href: '/sejarah', desc: 'Jejak langkah pengabdian sejak 2016' },
      { label: 'Pendidik & Struktur Organisasi', href: '/organisasi', desc: 'Guru berijazah S1 PAUD & konselor anak' },
      { label: 'Legalitas & Akreditasi A', href: '/legalitas', desc: 'SK Kemenkumham, NPSN, & izin operasional resmi', badge: 'Akreditasi A' },
      { label: 'Fasilitas Kampus', href: '/fasilitas', desc: 'Kelas ber-AC, CCTV 24 jam & playground aman' },
    ],
  },
  {
    label: 'Pendidikan',
    href: '/program',
    children: [
      { label: 'Semua Jenjang Kelas', href: '/program', desc: 'Ikhtisar jenjang KB, TK A, TK B, dan TPA' },
      { label: 'Playgroup / KB (3–4 Tahun)', href: '/program/kb', desc: 'Stimulasi sensori-motorik & sosialisasi ceria' },
      { label: 'TK A (4–5 Tahun)', href: '/program/tk-a', desc: 'Kemandirian, tahfidz awal & calistung fun' },
      { label: 'TK B Persiapan SD (5–6 Tahun)', href: '/program/tk-b', desc: 'Kesiapan akademis & adab masuk SD unggulan', badge: 'Populer' },
      { label: 'TPA & Tahfidz Cilik', href: '/program/tpa', desc: 'Bimbingan baca Al-Qur’an metode Tilawati' },
      { label: 'Kurikulum & 5 Sentra Belajar', href: '/kurikulum', desc: 'Metode BCCT, jadwal rutinitas & kompetensi' },
    ],
  },
  {
    label: 'PPDB 2026/2027',
    href: '/ppdb',
    children: [
      { label: 'Informasi & Alur PPDB', href: '/ppdb', desc: 'Tahapan pendaftaran, gelombang & kuota kelas' },
      { label: 'Rincian Biaya & Syarat', href: '/ppdb#syarat', desc: 'Transparansi uang pangkal, SPP & formulir', badge: 'Transparan' },
      { label: 'Formulir Pendaftaran Online', href: '/ppdb/daftar', desc: 'Daftar online 3 menit langsung konfirmasi WA', badge: 'Dibuka' },
      { label: 'Beasiswa Yatim & Dhuafa (100% Gratis)', href: '/yatim', desc: 'Program beasiswa penuh bebas seluruh biaya' },
    ],
  },
  {
    label: 'Khazanah & Aktivitas',
    href: '/berita',
    children: [
      { label: 'Berita & Agenda Kegiatan', href: '/berita', desc: 'Kabar terbaru dan dokumentasi acara sekolah' },
      { label: 'Galeri Foto Aktivitas', href: '/galeri', desc: 'Dokumentasi kegiatan belajar, ibadah & outing' },
      { label: 'Khazanah Islami & Parenting', href: '/konten-islami', desc: 'Mutiara hadits adab & artikel parenting Nabawi' },
      { label: 'Kumpulan Doa Harian Santri', href: '/doa', desc: 'Teks Arab berharakat, transliterasi & arti' },
      { label: 'Jadwal Sholat Real-Time', href: '/jadwal-sholat', desc: 'Jadwal waktu sholat harian akurat' },
      { label: 'Program Orang Tua Asuh', href: '/yatim/orangtua-asuh', desc: 'Menjadi wali asuh bagi santri yatim binaan' },
    ],
  },
  { label: 'Kontak', href: '/kontak' },
]

// ============================================================
// STATISTIK INSTITUSI
// ============================================================
export const quickStats = [
  { value: '180+', label: 'Siswa Aktif', note: 'KB, TK A, TK B & TPA' },
  { value: '1:7', label: 'Rasio Guru-Siswa', note: 'Pendampingan Maksimal' },
  { value: '35+', label: 'Anak Yatim Dibina', note: 'Beasiswa Penuh 100%' },
  { value: 'A', label: 'Akreditasi Unggul', note: 'Kemendikbudristek RI' },
]
