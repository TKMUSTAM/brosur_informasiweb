// ============================================================
// PENGETAHUAN CHATBOT LAYANAN INFORMASI
// ------------------------------------------------------------
// Edit konten jawaban di file ini. Struktur intent:
//  - strong:  kata kunci sangat spesifik (bobot ×3)
//  - keywords: kata kunci pendukung (bobot = panjang kata)
//  - links:    tombol cepat yang mengarah ke halaman terkait
// ============================================================

export type ChatLink = { label: string; href: string }

export type ChatIntent = {
  id: string
  strong?: string[]
  keywords: string[]
  answer: string
  links?: ChatLink[]
  suggestions?: string[]
}

export const FALLBACK: ChatIntent = {
  id: 'fallback',
  keywords: [],
  answer:
    'Maaf, saya belum menemukan jawaban untuk pertanyaan tersebut. Silakan coba pertanyaan lain atau hubungi kami langsung melalui WhatsApp untuk bantuan lebih lanjut.',
  links: [{ label: 'Hubungi via WhatsApp', href: '/kontak' }],
  suggestions: ['Bagaimana cara mendaftar PPDB?', 'Apa saja program pendidikannya?', 'Bagaimana kurikulum 5 sentra?'],
}

export const chatIntents: ChatIntent[] = [
  // ===== SAPAAN =====
  {
    id: 'greeting',
    strong: ['assalamualaikum', 'assalamu\'alaikum'],
    keywords: ['halo', 'hai', 'hello', 'hi', 'selamat pagi', 'selamat siang', 'selamat sore', 'permisi', 'pagi', 'siang'],
    answer:
      'Assalamualaikum! Selamat datang di layanan informasi Yayasan & TK Islam Al-Mustam. Ada yang bisa kami bantu mengenai pendaftaran (PPDB), kurikulum 5 sentra, biaya sekolah, atau kunjungan sekolah?',
    suggestions: ['Bagaimana cara mendaftar PPDB?', 'Apa saja program pendidikannya?', 'Berapa rincian biaya sekolah?'],
  },
  {
    id: 'thanks',
    keywords: ['terima kasih', 'makasih', 'syukron', 'jazakallah', 'jazakallahu', 'thanks', 'thank'],
    answer:
      'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain seputar Yayasan Mustam, jangan ragu untuk bertanya kembali.',
  },
  {
    id: 'bye',
    keywords: ['selamat tinggal', 'sampai jumpa', 'dadah', 'bye', 'permisi dulu'],
    answer:
      'Terima kasih sudah menghubungi kami. Assalamualaikum warahmatullahi wabarakatuh!',
  },

  // ===== PPDB =====
  {
    id: 'ppdb_umum',
    strong: ['ppdb', 'mendaftar', 'daftar sekolah', 'daftar tk', 'daftar kb', 'daftar tpa'],
    keywords: ['daftar', 'pendaftaran', 'formulir', 'cara daftar', 'mendaftarkan', 'registrasi', 'enrollment', 'siswa baru'],
    answer:
      'PPDB (Penerimaan Peserta Didik Baru) Tahun Ajaran 2026/2027 telah dibuka untuk TPA, KB, TK A, dan TK B.\n\nAlurnya mudah: isi formulir online → verifikasi data → observasi/wawancara → pengumuman → daftar ulang. Anak yatim/piatu mendapatkan beasiswa gratis biaya pendidikan.',
    links: [
      { label: 'Isi Formulir PPDB', href: '/ppdb/daftar' },
      { label: 'Lihat Alur PPDB', href: '/ppdb' },
    ],
    suggestions: ['Apa saja syarat pendaftarannya?', 'Berapa biaya pendidikannya?', 'Kapan batas pendaftarannya?'],
  },
  {
    id: 'ppdb_syarat',
    strong: ['syarat pendaftaran', 'persyaratan pendaftaran', 'syarat', 'persyaratan', 'berkas', 'dokumen'],
    keywords: ['pendaftaran', 'kk', 'akta', 'akta kelahiran', 'kartu keluarga', 'foto anak', 'pas foto', 'kelengkapan'],
    answer:
      'Persyaratan pendaftaran PPDB cukup sederhana:\n\n1. Fotokopi Kartu Keluarga\n2. Fotokopi Akta Kelahiran\n3. Pas foto anak 3×4 (2 lembar)\n4. Mengisi formulir pendaftaran\n\nUntuk anak yatim/piatu, cukup tunjukkan surat keterangan dari kelurahan untuk beasiswa gratis.',
    links: [{ label: 'Detail Persyaratan', href: '/ppdb' }],
  },
  {
    id: 'ppdb_jadwal',
    strong: ['batas pendaftaran', 'jadwal pendaftaran', 'gelombang'],
    keywords: ['kapan', 'tanggal', 'jadwal', 'ditutup', 'dibuka', 'ppdb', 'pendaftaran', 'buka pendaftaran', 'tenggat', 'deadline', 'tahun ajaran'],
    answer:
      'Jadwal penting PPDB 2026/2027:\n\n• Gelombang 1: 1 Juni – 15 Juli 2026 (pengumuman 20 Juli)\n• Gelombang 2: 16 Juli – 31 Agustus 2026 (pengumuman 5 September)\n• Daftar ulang: 7 – 19 September 2026\n• Tahun ajaran baru: 14 Juli 2026\n\nKuota terbatas setiap gelombang, sebaiknya segera mendaftar.',
    links: [{ label: 'Jadwal Lengkap PPDB', href: '/ppdb' }],
  },
  {
    id: 'ppdb_biaya',
    strong: ['biaya', 'spp', 'uang pangkal', 'biaya pendidikan'],
    keywords: ['harga', 'tarif', 'bayar', 'pembayaran', 'cicilan', 'murah', 'berapa'],
    answer:
      'Biaya pendidikan di Yayasan Mustam dirancang ringan dan dapat dicicil. Rincian lengkap biaya (pendaftaran, SPP, dan kegiatan) dapat dilihat di sekretariat atau ditanyakan langsung ke admin kami.\n\nCatatan: anak yatim/piatu dibebaskan dari biaya pendidikan, dan tersedia keringanan bagi keluarga dhuafa.',
    links: [{ label: 'Hubungi Admin', href: '/kontak' }],
    suggestions: ['Apa saja syarat pendaftarannya?', 'Apakah ada beasiswa untuk anak yatim?'],
  },
  {
    id: 'ppdb_beasiswa',
    strong: ['beasiswa', 'bebas biaya', 'gratis biaya'],
    keywords: ['anak yatim', 'yatim', 'piatu', 'keringanan', 'dhuafa', 'subsidi', 'diskon'],
    answer:
      'Ya, kami menyediakan beasiswa untuk anak yatim/piatu: seluruh biaya pendidikan ditanggung yayasan. Anak dari keluarga dhuafa juga dapat mengajukan keringanan biaya.\n\nCukup lampirkan surat keterangan dari kelurahan atau lembaga terkait saat pendaftaran.',
    links: [{ label: 'Program Yatim', href: '/yatim' }],
  },

  // ===== PROGRAM =====
  {
    id: 'program_umum',
    strong: ['program pendidikan', 'jenjang', 'kelas apa saja'],
    keywords: ['program', 'sekolah', 'tingkat', 'taman kanak', 'playgroup', 'paud'],
    answer:
      'Yayasan Mustam memiliki 4 program pendidikan:\n\n1. TPA — Taman Pendidikan Al-Qur\'an (usia 4–12 tahun)\n2. KB — Kelompok Bermain (usia 3–4 tahun)\n3. TK A — usia 4–5 tahun\n4. TK B — usia 5–6 tahun\n\nSemua program memadukan Kurikulum Merdeka dengan muatan diniyah.',
    links: [{ label: 'Lihat Semua Program', href: '/program' }],
    suggestions: ['Apa yang dipelajari di TK A?', 'Berapa usia minimal masuk KB?', 'Apa itu kurikulum diniyah?'],
  },
  {
    id: 'program_tpa',
    strong: ['tpa', 'taman pendidikan al-qur'],
    keywords: ['iqra', 'mengaji', 'al-qur\'an', 'tahsin', 'tahfiz', 'hafalan surat', 'tilawah', 'hijaiyah'],
    answer:
      'TPA (Taman Pendidikan Al-Qur\'an) diperuntukkan bagi anak usia 4–12 tahun. Anak belajar membaca Al-Qur\'an dengan metode iqra hingga tilawah, hafalan surat pendek dan doa harian, serta praktik wudhu dan sholat.\n\nJadwal: Senin–Kamis, 15.30–17.00 WIB. Rasio kelas 1:8 dengan ustadz/ustadzah bersertifikat.',
    links: [{ label: 'Detail TPA', href: '/program/tpa' }],
  },
  {
    id: 'program_kb',
    strong: ['kelompok bermain', 'kb'],
    keywords: ['playgroup', 'usia 3', 'balita', 'bermain sambil belajar'],
    answer:
      'KB (Kelompok Bermain) untuk anak usia 3–4 tahun. Anak belajar bersosialisasi, stimulasi motorik, pengenalan huruf dan angka, kegiatan seni, serta pembiasaan doa dan adab.\n\nJadwal: Senin–Jumat, 07.30–10.00 WIB. Rasio guru 1:6 agar pendampingan optimal.',
    links: [{ label: 'Detail KB', href: '/program/kb' }],
  },
  {
    id: 'program_tka',
    strong: ['tk a', 'tk-a', 'usia 4–5', 'usia 4-5'],
    keywords: ['kelas a', 'kelompok a'],
    answer:
      'TK A diperuntukkan bagi anak usia 4–5 tahun. Materinya mencakup calistung menyenangkan, hafalan doa dan surat pendek, praktik ibadah ringan, serta seni, musik, dan gerak.\n\nJadwal: Senin–Jumat, 07.30–11.00 WIB. Kapasitas 14 anak per kelas dengan rasio 1:7.',
    links: [{ label: 'Detail TK A', href: '/program/tk-a' }],
  },
  {
    id: 'program_tkb',
    strong: ['tk b', 'tk-b', 'usia 5–6', 'usia 5-6'],
    keywords: ['kelas b', 'kelompok b', 'kesiapan sd', 'masuk sd'],
    answer:
      'TK B diperuntukkan bagi anak usia 5–6 tahun, mempersiapkan anak memasuki jenjang SD: kesiapan membaca-menulis-berhitung, target hafalan lebih tinggi, praktik sholat, dan simulasi transisi ke SD.\n\nJadwal: Senin–Jumat, 07.30–11.30 WIB.',
    links: [{ label: 'Detail TK B', href: '/program/tk-b' }],
  },

  // ===== KURIKULUM =====
  {
    id: 'kurikulum',
    strong: ['kurikulum', 'kurikulum merdeka', 'muatan diniyah', 'diniyah'],
    keywords: ['materi', 'pelajaran', 'hafalan', 'doa harian', 'akhlak', 'adab', 'calistung', 'numerasi', 'pembelajaran'],
    answer:
      'Kami memadukan dua kurikulum:\n\n1. Kurikulum Merdeka — kerangka belajar nasional yang berpusat pada anak.\n2. Muatan Diniyah — pembiasaan ibadah dan akhlak sebagai pondasi karakter.\n\nMateri unggulan: Al-Qur\'an & Iqra, hafalan doa harian, hafalan surat pendek, akhlak & adab, praktik ibadah, bahasa, numerasi dasar, seni, motorik, serta sosial-emosional.',
    links: [{ label: 'Detail Kurikulum', href: '/kurikulum' }],
  },

  // ===== GURU =====
  {
    id: 'guru',
    strong: ['tenaga pendidik'],
    keywords: ['guru', 'ustadz', 'ustadzah', 'pengajar', 'pendidik', 'sertifikat', 'kualifikasi'],
    answer:
      'Yayasan Mustam memiliki 12 tenaga pendidik yang berdedikasi, terdiri dari ustadz/ustadzah bersertifikat untuk pengajaran Al-Qur\'an dan guru TK/KB lulusan S1 kependidikan. Setiap kelas didampingi 1–2 guru dengan rasio yang terkontrol.',
    links: [{ label: 'Struktur Organisasi', href: '/organisasi' }],
  },

  // ===== FASILITAS =====
  {
    id: 'fasilitas',
    strong: ['fasilitas'],
    keywords: ['ruang kelas', 'ac', 'bermain', 'mushola', 'perpustakaan', 'seni', 'kreativitas', 'taman', 'gedung'],
    answer:
      'Fasilitas kami dirancang aman dan ramah anak: 6 ruang kelas ber-AC, mushola untuk praktik ibadah, area bermain outdoor & indoor, perpustakaan mini, ruang seni & kreativitas, serta ruang guru dan kantor.',
    links: [{ label: 'Lihat Fasilitas', href: '/fasilitas' }],
  },

  // ===== YATIM & DONASI =====
  {
    id: 'yatim',
    strong: ['anak yatim', 'yatim piatu', 'program yatim'],
    keywords: ['yatim', 'piatu', 'pembinaan', 'santunan'],
    answer:
      'Program Yatim Piatu kami mencakup beasiswa pendidikan, makan sehat harian, pendampingan psikososial, serta kegiatan Ramadhan dan hari besar. Saat ini 30+ anak yatim aktif dibina dengan dukungan 80+ donatur.\n\nAnak yatim juga mendapat beasiswa gratis biaya pendidikan di TPA/KB/TK.',
    links: [
      { label: 'Program Yatim', href: '/yatim' },
      { label: 'Jadi Orang Tua Asuh', href: '/yatim/orangtua-asuh' },
    ],
    suggestions: ['Bagaimana cara berdonasi?', 'Bagaimana cara jadi orang tua asuh?', 'Di mana laporan transparansi dana?'],
  },
  {
    id: 'donasi',
    strong: ['donasi', 'berdonasi', 'donatur'],
    keywords: ['sedekah', 'infaq', 'zakat', 'wakaf', 'sumbangan', 'amal', 'santunan dana', 'transfer'],
    answer:
      'Terima kasih atas niat baik Anda! Donasi dapat disalurkan melalui form donasi online atau transfer manual ke rekening yayasan (BSI a.n. Yayasan Mustam).\n\nPilihan program: Pendidikan Yatim, Beasiswa, Makanan Anak, Fasilitas Sekolah, atau Bebas. Setiap donasi tercatat dan dilaporkan secara transparan.',
    links: [
      { label: 'Donasi Sekarang', href: '/yatim/donasi' },
      { label: 'Lihat Transparansi', href: '/yatim/transparansi' },
    ],
    suggestions: ['Program donasi apa saja yang tersedia?', 'Bagaimana cara jadi orang tua asuh?'],
  },
  {
    id: 'orangtua_asuh',
    strong: ['orang tua asuh', 'wali asuh', 'orangtua asuh'],
    keywords: ['asuh', 'mengasuh', 'dukung anak'],
    answer:
      'Program Orang Tua Asuh memungkinkan Anda mendukung seorang anak yatim secara berkelanjutan. Anda akan menerima laporan perkembangan setiap semester, kabar kegiatan anak, sertifikat wali asuh, dan doa anak-anak.\n\nCaranya: pilih anak → kesepakatan → mulai dukungan → pantau perkembangan.',
    links: [{ label: 'Detail Orang Tua Asuh', href: '/yatim/orangtua-asuh' }],
  },
  {
    id: 'transparansi',
    strong: ['transparansi', 'laporan dana', 'laporan keuangan'],
    keywords: ['laporan', 'keuangan', 'penyaluran', 'dana', 'rekap', 'rincian'],
    answer:
      'Kami berkomitmen transparan: laporan donasi per tahun (2024–2026) dapat dilihat publik, termasuk donasi terkumpul, dana tersalurkan, penerima manfaat, dan rincian distribusi per program serta per bulan.',
    links: [{ label: 'Lihat Laporan Transparansi', href: '/yatim/transparansi' }],
  },

  // ===== KONTEN ISLAMI =====
  {
    id: 'jadwal_sholat',
    strong: ['jadwal sholat', 'waktu sholat'],
    keywords: ['sholat', 'shalat', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'adzan', 'imsak'],
    answer:
      'Jadwal sholat di website kami dihitung otomatis berdasarkan lokasi Anda (metode Kemenag: Subuh 20°, Isya 18°). Anda juga dapat melihat jadwal lengkap beserta waktu imsak dan terbit matahari.',
    links: [{ label: 'Jadwal Sholat Hari Ini', href: '/jadwal-sholat' }],
  },
  {
    id: 'doa',
    strong: ['doa harian', 'kumpulan doa'],
    keywords: ['doa', 'artinya', 'latin', 'hafalan doa'],
    answer:
      'Kami menyediakan kumpulan doa harian lengkap dengan tulisan Arab, latin, dan artinya — mulai dari doa sebelum belajar, sebelum makan, sebelum tidur, hingga doa untuk kedua orang tua.',
    links: [{ label: 'Kumpulan Doa Harian', href: '/doa' }],
  },
  {
    id: 'konten_islami',
    keywords: ['artikel', 'parenting', 'kajian', 'konten islami', 'nasehat'],
    answer:
      'Di halaman Konten Islami tersedia doa harian, jadwal sholat, dan artikel parenting Islami seperti membiasakan anak mengucap salam dan mengenalkan masjid sejak dini.',
    links: [{ label: 'Jelajahi Konten Islami', href: '/konten-islami' }],
  },

  // ===== PROFIL & KONTAK =====
  {
    id: 'profil',
    strong: ['tentang yayasan', 'profil yayasan', 'tentang kami', 'visi misi', 'sejarah'],
    keywords: ['profil', 'sejarah', 'visi', 'misi', 'filosofi', 'didirikan', 'berdiri'],
    answer:
      'Yayasan Mustam adalah yayasan pendidikan Islam yang menaungi TPA, KB, TK A, TK B, serta program pendidikan dan pembinaan yatim piatu. Berdiri sejak 2016, kami berkomitmen "Menebar Ilmu, Menumbuhkan Akhlak" dengan tiga pilar: Adab, Akhlak, dan Aqidah.',
    links: [
      { label: 'Profil Yayasan', href: '/profil' },
      { label: 'Visi & Misi', href: '/visi-misi' },
    ],
  },
  {
    id: 'lokasi',
    strong: ['alamat', 'lokasi', 'di mana', 'dimana'],
    keywords: ['maps', 'gedung', 'alamat sekolah', 'petunjuk', 'arah'],
    answer:
      'Yayasan Mustam berlokasi di Jl. Pendidikan Islam No. 17, Kel. Melati Putih, Kec. Cendana, Kota Nusantara. Anda dapat melihat peta lokasi dan arah kunjungan di halaman kontak.',
    links: [{ label: 'Lihat Peta Lokasi', href: '/kontak' }],
  },
  {
    id: 'kontak',
    strong: ['kontak', 'hubungi', 'whatsapp'],
    keywords: ['telepon', 'telpon', 'email', 'instagram', 'facebook', 'youtube', 'admin', 'sekretariat'],
    answer:
      'Anda dapat menghubungi kami melalui:\n\n• WhatsApp: +62 812-3456-7890\n• Email: halo@yayasanmustam.id\n• Telepon: (021) 1234-5678\n\nJam operasional: Senin–Jumat, 07.00–15.00 WIB.',
    links: [{ label: 'Halaman Kontak', href: '/kontak' }],
  },
  {
    id: 'jam_operasional',
    strong: ['jam operasional', 'jam buka'],
    keywords: ['kunjungan', 'tour', 'study tour', 'open house', 'datang', 'berkunjung'],
    answer:
      'Jam operasional yayasan: Senin–Jumat, 07.00–15.00 WIB. Kami terbuka untuk kunjungan orang tua. Disarankan membuat janji terlebih dahulu melalui WhatsApp agar bisa didampingi tim kami.',
    links: [{ label: 'Hubungi Kami', href: '/kontak' }],
  },

  // ===== BERITA & LAINNYA =====
  {
    id: 'berita',
    keywords: ['berita', 'kegiatan', 'acara', 'event', 'agenda', 'pengumuman'],
    answer:
      'Kabar terbaru Yayasan Mustam dapat Anda ikuti di halaman Berita & Kegiatan — mulai dari kegiatan pembelajaran, kajian, PHBI, hingga penyaluran bantuan.',
    links: [{ label: 'Berita & Kegiatan', href: '/berita' }],
  },
  {
    id: 'galeri',
    keywords: ['galeri', 'foto', 'dokumentasi', 'video'],
    answer:
      'Dokumentasi kegiatan belajar, murojaah, PHBI, sosial, dan outing dapat dilihat di galeri kami. Foto-foto tersusun rapi dan dapat difilter per kategori.',
    links: [{ label: 'Buka Galeri', href: '/galeri' }],
  },
]

/** Pertanyaan cepat yang ditampilkan saat panel pertama dibuka. */
export const quickReplies = [
  'Bagaimana cara mendaftar PPDB?',
  'Apa saja program pendidikannya?',
  'Berapa rincian biaya pendidikannya?',
  'Apa saja kurikulum 5 sentra?',
  'Bagaimana jalur beasiswa yatim?',
  'Di mana lokasi kampus yayasan?',
]
