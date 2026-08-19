// ============================================================
// BERITA & KEGIATAN
// ============================================================

export type NewsItem = {
  slug: string
  title: string
  category: string
  date: string
  dateISO: string
  excerpt: string
  content: string[]
  color: 'green' | 'blue' | 'gold' | 'red'
  featured?: boolean
  image?: string // foto konten (placeholder sementara)
}

export const news: NewsItem[] = [
  {
    slug: 'peringatan-isra-miraj',
    title: 'Peringatan Isra Mi\u2019raj: Menanamkan Kecintaan Sholat pada Anak',
    category: 'PHBI',
    date: '5 Agustus 2026',
    dateISO: '2026-08-05',
    excerpt:
      'Kegiatan Isra Mi\u2019raj tahun ini dikemas dengan dongeng, lomba adzan, dan praktik sholat bersama agar anak-anak mencintai ibadah.',
    content: [
      'Peringatan Isra Mi\u2019raj 1448 H di Yayasan Mustam berlangsung meriah dan penuh makna. Rangkaian acara diawali dengan pembacaan ayat suci Al-Qur\u2019an oleh santri TPA.',
      'Anak-anak mengikuti lomba adzan, hafalan doa, dan mewarnai kaligrafi sederhana. Puncak acara adalah praktik sholat berjamaah yang dipandu para ustadzah.',
      'Kami berharap kegiatan ini menumbuhkan kecintaan anak-anak terhadap sholat sejak usia dini.',
    ],
    color: 'green',
    featured: true,
    image: '/images/content/news-isra-miraj.jpg',
  },
  {
    slug: 'outing-kelas-tk',
    title: 'Serunya Outing Class TK ke Kebun Pendidikan',
    category: 'Kegiatan Anak',
    date: '22 Juli 2026',
    dateISO: '2026-07-22',
    excerpt:
      'Anak-anak TK A dan TK B belajar mengenal tanaman, hewan, dan ciptaan Allah secara langsung di kebun pendidikan.',
    content: [
      'Outing class kali ini mengajak anak-anak TK A dan TK B belajar di kebun pendidikan. Mereka mengenal berbagai jenis sayuran, serangga, dan proses tumbuhnya tanaman.',
      'Kegiatan ini melatih rasa syukur, kepekaan lingkungan, dan rasa ingin tahu anak terhadap ciptaan Allah SWT.',
      'Sepulang dari kebun, anak-anak diminta menggambar apa yang paling mereka sukai selama kunjungan.',
    ],
    color: 'blue',
    image: '/images/content/news-outing.jpg',
  },
  {
    slug: 'kajian-parenting',
    title: 'Kajian Parenting: Mengasuh Anak di Era Digital',
    category: 'Kajian',
    date: '10 Juli 2026',
    dateISO: '2026-07-10',
    excerpt:
      'Kajian rutin orang tua bulan ini membahas strategi mendampingi anak bermain gawai sesuai tuntunan Islam.',
    content: [
      'Kajian parenting diadakan setiap bulan kedua untuk orang tua siswa. Bulan ini tema yang diangkat adalah pengasuhan anak di era digital.',
      'Narasumber membahas batasan usia penggunaan gawai, konten yang layak, dan pengganti aktivitas layar dengan kegiatan bersama keluarga.',
      'Diskusi berjalan hangat dan dihadiri lebih dari 40 orang tua siswa.',
    ],
    color: 'gold',
    image: '/images/content/news-parenting.jpg',
  },
  {
    slug: 'penyaluran-beasiswa-yatim',
    title: 'Penyaluran Beasiswa Pendidikan untuk Anak Yatim',
    category: 'Yatim',
    date: '28 Juni 2026',
    dateISO: '2026-06-28',
    excerpt:
      'Berkat donasi para sahabat, 15 anak yatim menerima beasiswa perlengkapan dan biaya pendidikan untuk semester ini.',
    content: [
      'Program beasiswa yatim semester genap telah tersalurkan kepada 15 anak. Setiap penerima mendapatkan perlengkapan sekolah dan bantuan biaya pendidikan.',
      'Penyaluran dilakukan langsung oleh koordinator program yatim dengan pendampingan wali asuh.',
      'Laporan lengkap penyaluran dapat dilihat pada halaman transparansi dana.',
    ],
    color: 'red',
    image: '/images/content/news-beasiswa.jpg',
  },
  {
    slug: 'murojaah-bersama',
    title: 'Murojaah Bersama: Menjaga Hafalan di Bulan Penuh Berkah',
    category: 'Pendidikan',
    date: '12 Juni 2026',
    dateISO: '2026-06-12',
    excerpt:
      'Kegiatan murojaah berjamaah setiap Jumat pagi membantu anak-anak menjaga hafalan surat pendek dan doa harian.',
    content: [
      'Setiap Jumat pagi, seluruh santri mengikuti murojaah bersama di halaman utama yayasan.',
      'Kegiatan dipimpin bergantian oleh siswa untuk melatih keberanian dan rasa percaya diri.',
      'Orang tua dapat memantau perkembangan hafalan anak melalui buku murojaah yang dibawa pulang.',
    ],
    color: 'green',
    image: '/images/content/news-murojaah.jpg',
  },
  {
    slug: 'bakti-sosial-yatim',
    title: 'Bakti Sosial: Berbagi Paket Sembako untuk Keluarga Yatim',
    category: 'Sosial',
    date: '2 Juni 2026',
    dateISO: '2026-06-02',
    excerpt:
      'Yayasan menyalurkan 30 paket sembako kepada keluarga yatim di sekitar lingkungan sekolah.',
    content: [
      'Bakti sosial dilaksanakan sebagai wujud kepedulian terhadap keluarga yatim dan dhuafa di lingkungan sekitar.',
      '30 paket sembako disalurkan dengan pendataan dan kunjungan langsung ke rumah penerima.',
      'Kegiatan ini didukung penuh oleh para donatur setia Yayasan Mustam.',
    ],
    color: 'blue',
    image: '/images/content/news-baksos.jpg',
  },
]

export const newsCategories = ['Semua', 'Pendidikan', 'Kajian', 'PHBI', 'Kegiatan Anak', 'Sosial', 'Yatim']
