// ============================================================
// DATA PROGRAM PENDIDIKAN & KURIKULUM — TK ISLAM AL-MUSTAM
// ============================================================

export type Program = {
  slug: string
  code: string
  name: string
  subtitle: string
  age: string
  ageRange: string
  color: 'green' | 'blue' | 'gold' | 'red'
  icon: string
  description: string
  highlights: string[]
  schedule: string
  capacity: string
  ratio: string
  image: string
  objectives: string[]
}

export const programs: Program[] = [
  {
    slug: 'kb',
    code: 'KB',
    name: 'Kelompok Bermain (Playgroup)',
    subtitle: 'Eksplorasi Sensori, Sosialisasi & Adab Mandiri',
    age: '3–4 Tahun',
    ageRange: 'Usia 3–4 tahun',
    color: 'blue',
    icon: 'blocks',
    description:
      'Langkah awal yang menyenangkan untuk si kecil. Menggunakan pendekatan *learning through play* dan stimulasi sensori-motorik, melatih kemandirian, sosialisasi, toilet training, serta pembiasaan doa dan adab harian dengan kasih sayang para ustadzah.',
    highlights: [
      'Stimulasi sensori-motorik & motorik halus',
      'Toilet training & kemandirian makan sendiri',
      'Pengenalan huruf hijaiyah & fonik interaktif',
      'Pembiasaan doa harian, kalimat thoyyibah & adab',
      'Sosialisasi ceria & regulasi emosi anak',
    ],
    schedule: 'Senin–Jumat, 07.30 – 10.00 WIB',
    capacity: '12 anak per kelas',
    ratio: '1 : 6 (2 Guru per kelas)',
    image: '/images/content/prog-kb.jpg',
    objectives: [
      'Anak mampu beradaptasi di lingkungan sekolah tanpa cemas berpisah',
      'Anak memiliki koordinasi motorik yang matang dan rasa ingin tahu tinggi',
      'Mengenal nilai-nilai ketauhidan dasar melalui lagu dan cerita Islami',
    ],
  },
  {
    slug: 'tk-a',
    code: 'TK A',
    name: 'Taman Kanak-Kanak A',
    subtitle: 'Fondasi Karakter, Tahfidz & Literasi Dasar',
    age: '4–5 Tahun',
    ageRange: 'Usia 4–5 tahun',
    color: 'gold',
    icon: 'pencil',
    description:
      'Mengembangkan kecerdasan majemuk (*Multiple Intelligences*) anak melalui Kurikulum Merdeka yang terintegrasi dengan nilai-nilai Qur’ani. Anak aktif belajar dalam 5 sentra tematik, tahfidz juz 30 metode Tilawati, hafalan hadits pendek, dan calistung sensori tanpa paksaan.',
    highlights: [
      'Tahfidz Juz 30 (Target: An-Naas s.d Al-Fiil)',
      'Sentra Imtaq, Sentra Balok, & Sentra Bahan Alam',
      'Praktik wudhu & sholat dhuha berjamaah',
      'Calistung menyenangkan dengan media konkret',
      'Pengenalan kosakata bilingual (Arab & Inggris sehari-hari)',
    ],
    schedule: 'Senin–Jumat, 07.30 – 11.00 WIB',
    capacity: '14 anak per kelas',
    ratio: '1 : 7',
    image: '/images/content/prog-tk-a.jpg',
    objectives: [
      'Menguasai bacaan doa harian dan surat pendek dengan makhraj tepat',
      'Mampu mengekspresikan ide, bercerita, dan berhitung logis sederhana',
      'Tumbuh percaya diri, peduli pada teman, dan disiplin antre',
    ],
  },
  {
    slug: 'tk-b',
    code: 'TK B',
    name: 'Taman Kanak-Kanak B',
    subtitle: 'Kesiapan Matang Memasuki Sekolah Dasar (SD Unggulan)',
    age: '5–6 Tahun',
    ageRange: 'Usia 5–6 tahun',
    color: 'red',
    icon: 'star',
    description:
      'Program pemantapan holistik yang mempersiapkan anak memasuki jenjang SD/MI unggulan. Memperkuat kemampuan literasi-numerasi kritis, ketangkasan motorik, kepemimpinan cilik, kemandirian penuh, serta target hafalan surat pendek dan hadits pilihan yang lebih luas.',
    highlights: [
      'Kesiapan literasi membaca lancar & numerasi logis',
      'Tahfidz lanjutan Juz 30 (Target s.d An-Naba’ bagian awal)',
      'Gerakan dan bacaan sholat fardhu secara mandiri',
      'Proyek kolaborasi sains cilik & eksplorasi alam',
      'Simulasi transisi dan adaptasi psikologis ke jenjang SD',
    ],
    schedule: 'Senin–Jumat, 07.30 – 11.30 WIB',
    capacity: '14 anak per kelas',
    ratio: '1 : 7',
    image: '/images/content/prog-tk-b.jpg',
    objectives: [
      '100% siswa lulusan siap dan percaya diri menempuh tes masuk SD favorit',
      'Memiliki adab Islami yang kokoh kepada guru, orang tua, dan sesama',
      'Mampu menyelesaikan masalah sederhana dan bekerja sama dalam tim',
    ],
  },
  {
    slug: 'tpa',
    code: 'TPA',
    name: 'TPA & Tahfidz Cilik Al-Mustam',
    subtitle: 'Bimbingan Tilawah, Tartil & Karakter Santri',
    age: '4–12 Tahun',
    ageRange: 'Usia 4–12 tahun',
    color: 'green',
    icon: 'quran',
    description:
      'Program sore untuk pembinaan baca-tulis Al-Qur’an dengan metode Tilawati/Ummi berstandar. Dibimbing oleh ustadz dan ustadzah hafidz/hafidzah bersertifikat dengan suasana belajar yang menyenangkan, menanamkan kecintaan mendalam pada kalamullah sejak dini.',
    highlights: [
      'Metode Tilawati berjenjang dari jilid 1 hingga Al-Qur’an tartil',
      'Bimbingan tahsin makharijul huruf & hukum tajwid',
      'Program setor hafalan mandiri bersanad',
      'Kisah teladan 25 Nabi dan Sahabat Rasulullah SAW',
      'Laporan perkembangan muraja’ah berkala untuk orang tua',
    ],
    schedule: 'Senin–Kamis, 15.30 – 17.15 WIB',
    capacity: '15 santri per kelas',
    ratio: '1 : 8',
    image: '/images/content/prog-tpa.jpg',
    objectives: [
      'Santri mampu membaca Al-Qur’an dengan tartil, fasih, dan tartil',
      'Mencetak generasi pecinta Al-Qur’an yang berakhlak karimah',
      'Hafal juz 30 serta doa dan dzikir harian mustajab',
    ],
  },
]

// ============================================================
// 5 SENTRA PEMBELAJARAN (BCCT - BEYOND CENTERS AND CIRCLE TIME)
// ============================================================
export const sentraList = [
  {
    id: 'imtaq',
    name: 'Sentra Imtaq & Al-Qur’an',
    badge: 'Spiritual & Adab',
    desc: 'Pengenalan rukun Islam, praktik ibadah sholat, hafalan surat & doa, kisah teladan nabi dengan media visual interaktif.',
    color: 'emerald',
  },
  {
    id: 'bahan-alam',
    name: 'Sentra Bahan Alam & Sains',
    badge: 'Eksplorasi Sains',
    desc: 'Eksperimen sains sederhana, mengenal tekstur pasir, air, biji-bijian, menanam bibit, dan mensyukuri ciptaan Allah.',
    color: 'amber',
  },
  {
    id: 'balok',
    name: 'Sentra Balok & Konstruksi',
    badge: 'Spasial & Logika',
    desc: 'Membangun miniatur kota, masjid, dan jembatan dengan balok kayu terstandar untuk melatih logika spasial dan kerja sama.',
    color: 'blue',
  },
  {
    id: 'seni',
    name: 'Sentra Seni & Kreativitas',
    badge: 'Kreativitas & Motorik',
    desc: 'Mengeksplorasi warna, melukis dengan kuas & finger painting, origami, kaligrafi ramah anak, dan kolase bahan daur ulang.',
    color: 'rose',
  },
  {
    id: 'persiapan',
    name: 'Sentra Persiapan & Literasi',
    badge: 'Literasi & Numerasi',
    desc: 'Merangsang kesiapan membaca, menulis, dan berhitung melalui flashcards, kartu huruf magnetik, puzzle logika, dan dongeng bergambar.',
    color: 'purple',
  },
]

// ============================================================
// JADWAL RUTINITAS HARIAN (DAILY ROUTINE)
// ============================================================
export const dailyRoutines = [
  {
    time: '07.15 – 07.45',
    title: 'Penyambutan Senyum & Gerak Ceria',
    desc: 'Penyambutan 5S (Senyum, Sapa, Salam, Sopan, Santun) oleh guru, senam motorik kasar ceria, dan ikrar santri.',
  },
  {
    time: '07.45 – 08.20',
    title: 'Morning Circle & Sholat Dhuha',
    desc: 'Wudhu bersama, Sholat Dhuha berjamaah di Musholla Cilik, muroja’ah surat pendek, dan asmaul husna.',
  },
  {
    time: '08.20 – 09.30',
    title: 'Aktivitas Sentra Tematik (BCCT)',
    desc: 'Pijakan sebelum main, proses bermain bermakna di sentra pilihan (Imtaq/Sains/Balok/Seni/Persiapan), dan beres-beres (recalling).',
  },
  {
    time: '09.30 – 10.00',
    title: 'Snack Time Higienis & Toilet Training',
    desc: 'Mencuci tangan dengan 6 langkah, doa sebelum makan, adab makan duduk dan tangan kanan, serta toilet training.',
  },
  {
    time: '10.00 – 10.45',
    title: 'Tahfidz Al-Qur’an & Sirah Nabawiyah',
    desc: 'Bimbingan tilawati/tahfidz privat per kelompok kecil dan kisah inspiratif sahabat Nabi SAW.',
  },
  {
    time: '10.45 – 11.15',
    title: 'Outdoor Play & Edukasi Lingkungan',
    desc: 'Bermain bebas terawasi di playground aman, menyiram tanaman hidroponik, dan bermain pasir sensori.',
  },
  {
    time: '11.15 – 11.30',
    title: 'Closing Circle & Penjemputan Aman',
    desc: 'Refleksi hari ini, pesan kebaikan esok hari, doa kafaratul majlis, dan penjemputan dengan sistem kartu verifikasi.',
  },
]

// ============================================================
// KELOMPOK KURIKULUM TERPADU
// ============================================================
export const curriculumGroups = [
  {
    title: 'Kurikulum Merdeka PAUD',
    icon: 'sparkles',
    note: 'Pembelajaran berbasis proyek (P5) dan berpusat pada minat unik anak.',
  },
  {
    title: 'Integrasi Nilai Qur’ani & Diniyah',
    icon: 'mosque',
    note: 'Pembiasaan ibadah praktis, tahfidz Juz 30, dan adab akhlaqul karimah.',
  },
  {
    title: 'Metode Sentra (BCCT)',
    icon: 'blocks',
    note: 'Sentra Imtaq, Balok, Sains Bahan Alam, Seni Kreatif, dan Persiapan.',
  },
]

export const curriculumItems = [
  { label: 'Tahfidz Juz 30 & Hadits Pilihan', icon: 'quran' },
  { label: 'Praktik Sholat Dhuha & Wudhu Sempurna', icon: 'mosque' },
  { label: 'Hafalan Doa Harian & Dzikir Pagi', icon: 'hands' },
  { label: 'Adab Islami & Karakter Mandiri', icon: 'heart' },
  { label: 'Literasi Menyenangkan & Fonik', icon: 'book' },
  { label: 'Numerasi Logis & Eksplorasi Sains', icon: 'calculator' },
  { label: 'Bilingual Daily Phrases (Arab & Inggris)', icon: 'message' },
  { label: 'Seni Rupa, Musik Perkusi & Kreativitas', icon: 'palette' },
  { label: 'Motorik Kasar, Halus & Sensori Park', icon: 'blocks' },
  { label: 'Regulasi Emosi & Empati Sosial', icon: 'users' },
]
