// ============================================================
// GALERI
// ============================================================

export type GalleryItem = {
  id: number
  title: string
  category: string
  scene: string // variant ilustrasi
  palette: 'green' | 'blue' | 'gold' | 'red' | 'mixed'
  tall?: boolean
  image?: string // foto konten (placeholder sementara)
}

export const galleryCategories = [
  'Semua',
  'Pembelajaran',
  'Murojaah',
  'Kegiatan',
  'PHBI',
  'Sosial',
  'Outing',
]

export const gallery: GalleryItem[] = [
  { id: 1, title: 'Belajar Iqra Bersama Ustadzah', category: 'Pembelajaran', scene: 'quran', palette: 'green', image: '/images/content/galeri-1.jpg' },
  { id: 2, title: 'Murojaah Hafalan Pagi', category: 'Murojaah', scene: 'read', palette: 'blue', tall: true, image: '/images/content/galeri-2.jpg' },
  { id: 3, title: 'Bermain Balok Edukatif', category: 'Kegiatan', scene: 'blocks', palette: 'gold', image: '/images/content/galeri-3.jpg' },
  { id: 4, title: 'Lomba Adzan Isra Mi\u2019raj', category: 'PHBI', scene: 'mosque', palette: 'red', tall: true, image: '/images/content/galeri-4.jpg' },
  { id: 5, title: 'Berkebun di Kebun Pendidikan', category: 'Outing', scene: 'nature', palette: 'mixed', image: '/images/content/galeri-5.jpg' },
  { id: 6, title: 'Praktik Wudhu dan Sholat', category: 'Pembelajaran', scene: 'pray', palette: 'green', image: '/images/content/galeri-6.jpg' },
  { id: 7, title: 'Penyaluran Sembako Keluarga Yatim', category: 'Sosial', scene: 'share', palette: 'red', image: '/images/content/galeri-7.jpg' },
  { id: 8, title: 'Seni Mewarnai Kaligrafi', category: 'Kegiatan', scene: 'paint', palette: 'gold', tall: true, image: '/images/content/galeri-8.jpg' },
  { id: 9, title: 'Kunjungan Edukasi ke Perpustakaan', category: 'Outing', scene: 'books', palette: 'blue', image: '/images/content/galeri-9.jpg' },
  { id: 10, title: 'Doa Bersama Sebelum Belajar', category: 'Murojaah', scene: 'hands', palette: 'mixed', image: '/images/content/galeri-10.jpg' },
  { id: 11, title: 'Peringatan Maulid Nabi', category: 'PHBI', scene: 'mosque', palette: 'green', image: '/images/content/galeri-11.jpg' },
  { id: 12, title: 'Bermain Peran di Pojok Kelas', category: 'Kegiatan', scene: 'blocks', palette: 'blue', image: '/images/content/galeri-12.jpg' },
]
