// ============================================================
// KONTEN: 7 Pilar Karakter, Guru & Pendidik, Fasilitas, Testimoni
// Yayasan & TK Islam Al-Mustam
// ============================================================

// ===== 7 PILAR KARAKTER UNGGULAN AL-MUSTAM =====
export const pillars = [
  {
    number: '01',
    title: 'Adab & Akhlaqul Karimah',
    icon: 'heart',
    color: 'red' as const,
    description:
      'Menanamkan pembiasaan 5S (Senyum, Salam, Sapa, Sopan, Santun), adab makan duduk, menghormati orang tua dan menyayangi sesama teman sejak usia dini.',
  },
  {
    number: '02',
    title: 'Tahfidz & Cinta Al-Qur’an',
    icon: 'quran',
    color: 'green' as const,
    description:
      'Metode Tilawati yang ramah anak, melafalkan makhraj dengan benar, hafalan surat-surat pendek Juz 30, serta pengenalan kisah teladan para Nabi.',
  },
  {
    number: '03',
    title: 'Aqidah Shahihah & Ibadah',
    icon: 'star',
    color: 'gold' as const,
    description:
      'Mengenal Allah SWT melalui keindahan ciptaan-Nya, praktik sholat dhuha berjamaah setiap pagi, wudhu tertib, dan hafalan doa harian.',
  },
  {
    number: '04',
    title: 'Kemandirian & Disiplin Diri',
    icon: 'leaf',
    color: 'green' as const,
    description:
      'Melatih toilet training mandiri, merapikan mainan sendiri, memakai sepatu, dan kemampuan menyelesaikan masalah secara percaya diri.',
  },
  {
    number: '05',
    title: 'Calistung Fun & Sensori',
    icon: 'book',
    color: 'blue' as const,
    description:
      'Kesiapan membaca dan berhitung tanpa paksaan melalui alat peraga edukatif konkret (APE), bermain peran, sains eksplorasi, dan dongeng interaktif.',
  },
  {
    number: '06',
    title: 'Bilingual Daily Phrases',
    icon: 'message',
    color: 'gold' as const,
    description:
      'Pembiasaan percakapan harian kosakata sederhana Bahasa Arab dan Bahasa Inggris dalam sapaan, doa, dan instruksi kelas yang menyenangkan.',
  },
  {
    number: '07',
    title: 'Kepedulian & Sedekah Subuh',
    icon: 'hands',
    color: 'red' as const,
    description:
      'Mengasah empati sosial sejak kecil lewat kencleng Sedekah Subuh Jumat Berkah, berbagi makanan sehat, dan program santunan sahabat yatim.',
  },
]

// ===== HADITS ADAB PILIHAN ANAK =====
export type HaditsItem = {
  title: string
  arabic: string
  latin: string
  meaning: string
  narrator: string
}

export const haditsList: HaditsItem[] = [
  {
    title: 'Hadits Senyum adalah Sedekah',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    latin: 'Tabassumuka fii wajhi akhiika laka shodaqoh',
    meaning: 'Senyummu di hadapan saudaramu adalah sedekah bagimu.',
    narrator: 'HR. Tirmidzi',
  },
  {
    title: 'Hadits Menjaga Kebersihan',
    arabic: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
    latin: 'Ath-thahuuru syathrul iimaan',
    meaning: 'Kebersihan dan bersuci itu adalah sebagian dari iman.',
    narrator: 'HR. Muslim',
  },
  {
    title: 'Hadits Adab Makan dengan Tangan Kanan',
    arabic: 'سَمِّ اللَّهَ وَكُلْ بِيَمِينِكَ وَكُلْ مِمَّا يَلِيكَ',
    latin: 'Sammillaaha wa kul bi yamiinika wa kul mimmaa yaliika',
    meaning: 'Bacalah bismillah, makanlah dengan tangan kananmu, dan ambillah makanan yang ada di dekatmu.',
    narrator: 'HR. Bukhari & Muslim',
  },
  {
    title: 'Hadits Menuntut Ilmu Itu Wajib',
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    latin: 'Tholabul ‘ilmi fariidhotun ‘alaa kulli muslim',
    meaning: 'Menuntut ilmu itu wajib bagi setiap muslim.',
    narrator: 'HR. Ibnu Majah',
  },
]

// ===== DOA HARIAN =====
export type Doa = {
  slug: string
  title: string
  arabic: string
  latin: string
  meaning: string
  virtue?: string
  category: string
}

export const doas: Doa[] = [
  {
    slug: 'sebelum-belajar',
    title: 'Doa Sebelum Belajar',
    category: 'Doa Harian',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا وَاجْعَلْنِي مِنَ الصَّالِحِينَ',
    latin: 'Robbii zidnii ‘ilmaa warzuqnii fahmaa waj’alnii minash-shoolihiin',
    meaning: 'Ya Tuhanku, tambahkanlah ilmuku, berikanlah aku rezeki kepahaman yang luas, dan jadikanlah aku termasuk golongan orang-orang yang sholeh.',
    virtue: 'Dibaca setiap pagi saat Morning Circle sebelum memulai kegiatan sentra.',
  },
  {
    slug: 'sebelum-makan',
    title: 'Doa Sebelum Makan',
    category: 'Doa Harian',
    arabic: 'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa ‘adzaaban-naar',
    meaning: 'Ya Allah, berkahilah kami pada rezeki yang telah Engkau karuniakan dan peliharalah kami dari siksa api neraka.',
    virtue: 'Dibaca dengan khusyuk sebelum menikmati snack time sehat.',
  },
  {
    slug: 'sesudah-makan',
    title: 'Doa Sesudah Makan',
    category: 'Doa Harian',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdulillahil ladzii ath’amanaa wa saqoonaa wa ja’alanaa muslimiin',
    meaning: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang muslim.',
    virtue: 'Bentuk syukur atas nikmat rezeki dan makanan bergizi.',
  },
  {
    slug: 'kedua-orang-tua',
    title: 'Doa untuk Kedua Orang Tua',
    category: 'Doa Harian',
    arabic: 'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا',
    latin: 'Robbighfir lii wa liwaalidayya warhamhumaa kamaa robbayaanii shoghiiroo',
    meaning: 'Wahai Tuhanku, ampunilah dosaku dan dosa kedua orang tuaku, serta sayangilah mereka berdua sebagaimana mereka menyayangiku di waktu kecil.',
    virtue: 'Membina cinta dan bakti anak kepada ayah dan bunda.',
  },
  {
    slug: 'keluar-rumah',
    title: 'Doa Keluar Rumah / Menuju Sekolah',
    category: 'Doa Harian',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
    latin: 'Bismillahi tawakkaltu ‘alallah, laa hawla wa laa quwwata illaa billaah',
    meaning: 'Dengan menyebut nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
    virtue: 'Perlindungan dari bahaya selama perjalanan menuju sekolah.',
  },
  {
    slug: 'penutup-majlis',
    title: 'Doa Kafaratul Majlis (Penutup Kelas)',
    category: 'Doa Harian',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    latin: 'Subhaanakallahumma wa bihamdika, asyhadu an laa ilaaha illaa anta, astaghfiruka wa atuubu ilaik',
    meaning: 'Maha Suci Engkau ya Allah, dan dengan memuji-Mu, aku bersaksi bahwa tiada Tuhan yang berhak disembah selain Engkau, aku memohon ampun dan bertaubat kepada-Mu.',
    virtue: 'Menutup majelis ilmu dan menghapus kekhilafan selama belajar.',
  },
]

// ===== ARTIKEL PARENTING ISLAMI =====
export const islamicArticles = [
  {
    slug: 'mendidik-anak-tanpa-bentakan',
    title: 'Seni Mendidik Anak Usia Dini Tanpa Bentakan Sesuai Sunnah',
    excerpt:
      'Bagaimana Rasulullah SAW mendidik anak-anak kecil dengan teladan kelembutan, validasi emosi, dan ketegasan penuh kasih sayang.',
    category: 'Parenting Nabawiyah',
    readTime: '4 menit',
    content: [
      'Anak usia dini menyerap energi emosi orang tua; berbicara dengan nada tenang jauh lebih efektif daripada teriakan.',
      'Dengarkan dan beri nama perasaan anak (misal: "Kakak sedang sedih ya mainannya jatuh?").',
      'Fokus pada perilaku alternatif yang benar, bukan sekadar melarang (misal: "Yuk kita taruh di meja pelan-pelan").',
      'Rasulullah SAW tidak pernah memukul atau membentak pelayan maupun anak kecil selama hidup beliau.',
    ],
  },
  {
    slug: 'membiasakan-sholat-gembira',
    title: '5 Kiat Menjadikan Ibadah Sholat Momen yang Dirindukan Anak',
    excerpt:
      'Mengenalkan sholat bukan sebagai beban kewajiban yang kaku, melainkan momen penuh kehangatan dan kebersamaan keluarga.',
    category: 'Pendidikan Karakter',
    readTime: '5 menit',
    content: [
      'Siapkan sajadah mini dan mukena/sarung dengan warna favorit anak.',
      'Ajak anak sholat bersama tanpa memaksakan kesempurnaan gerakan pada awal mula.',
      'Berikan pelukan hangat dan senyuman setelah salam sebagai asosiasi positif.',
      'Ceritakan bahwa sholat adalah waktu kita berbicara langsung dan curhat kepada Allah Sang Maha Pengasih.',
    ],
  },
  {
    slug: 'stimulasi-sensori-pramembaca',
    title: 'Pentingnya Sensori Motorik Sebelum Anak Belajar Membaca dan Menulis',
    excerpt:
      'Mengapa meremas playdough, melompat, dan menyusun balok adalah fondasi penting sebelum memegang pensil dengan benar.',
    category: 'Tumbuh Kembang',
    readTime: '4 menit',
    content: [
      'Otot jari dan tangan anak membutuhkan latihan kekuatan sebelum mampu mencengkeram pensil secara ergonomis.',
      'Aktivitas meronce manik-manik, melipat kertas, dan bermain pasir melatih koordinasi mata dan tangan (visual motor).',
      'Di TK Islam Al-Mustam, calistung disajikan lewat media konkret agar anak tidak stres dan cinta belajar seumur hidup.',
    ],
  },
]

// ===== TESTIMONIAL WALI MURID =====
export const testimonials = [
  {
    name: 'dr. Sarah Nabila, Sp.A',
    status: 'Wali Murid Ananda Kenzie (TK B)',
    avatarColor: 'green' as const,
    initials: 'SN',
    quote:
      'Sebagai dokter anak, saya sangat selektif memilih sekolah. TK Islam Al-Mustam luar biasa memperhatikan stimulasi sensori, higienitas makan, dan kesehatan mental anak. Anak saya sekarang sangat santun dan hafal juz 30 dengan tartil yang fasih.',
  },
  {
    name: 'Bapak Ahmad Fauzi, S.T.',
    status: 'Wali Murid Ananda Aisyah (TK A)',
    avatarColor: 'gold' as const,
    initials: 'AF',
    quote:
      'Semula anak saya sangat pemalu dan susah lepas dari gadget. Setelah 3 bulan di Al-Mustam, keberaniannya bicara dan empati sosialnya meningkat pesat. Setiap sore selalu semangat bercerita kegiatan seru di Sentra Bahan Alam.',
  },
  {
    name: 'Ibu Hj. Ratna Kusuma Dewi',
    status: 'Orang Tua Asuh 3 Anak Yatim Binaan',
    avatarColor: 'red' as const,
    initials: 'RK',
    quote:
      'Amanah dan transparansi Yayasan Al-Mustam sangat teruji. Setiap bulan ada laporan tertulis dan video perkembangan belajar anak asuh. Senang sekali melihat mereka tumbuh ceria dan berprestasi seperti anak-anak lainnya.',
  },
  {
    name: 'Bapak Muhammad Reza, M.M.',
    status: 'Wali Murid Ananda Bilal (Playgroup / KB)',
    avatarColor: 'blue' as const,
    initials: 'MR',
    quote:
      'Guru-guru di KB Al-Mustam sangat sabar dan keibuan. Toilet training anak saya berhasil tuntas dalam waktu 2 minggu tanpa drama. Suasana sekolahnya sejuk, asri, dan komunikasinya sangat terbuka dengan wali murid.',
  },
]

// ===== STRUKTUR ORGANISASI & TENAGA PENDIDIK =====
export const organization = [
  {
    role: 'Pembina Yayasan',
    name: 'KH. Ahmad Mustam, S.Ag., M.Pd.I.',
    note: 'Ulama, Praktisi Pendidikan Islam & Pembina Lembaga',
  },
  {
    role: 'Ketua Pengurus Yayasan',
    name: 'Ustadz Fauzan Hakim, M.Ed.',
    note: 'Alumni Pendidikan Luar Sekolah, Pengembang Kurikulum',
  },
  {
    role: 'Kepala Sekolah TK Islam Al-Mustam',
    name: 'Ustadzah Siti Maryam, S.Pd. PAUD',
    note: 'Praktisi PAUD Berprestasi, Asesor Akreditasi',
  },
  {
    role: 'Koordinator Tahfidz & TPA',
    name: 'Ustadz Abdul Rauf Al-Hafidz, S.Q.',
    note: 'Hafidz 30 Juz Bersanad, Master Trainer Tilawati',
  },
  {
    role: 'Konselor Tumbuh Kembang & Psikolog Anak',
    name: 'Nanda Safitri, M.Psi., Psikolog',
    note: 'Spesialis Observasi Sensori & Stimulasi Dini',
  },
  {
    role: 'Koordinator Program Sosial & Beasiswa Yatim',
    name: 'Ustadzah Laila Nurfadilah, S.Sos.',
    note: 'Pendampingan Karakter & Penyaluran Beasiswa Penuh',
  },
  {
    role: 'Bendahara & Akuntabilitas Yayasan',
    name: 'Hj. Rina Marlina, S.E., Ak.',
    note: 'Tata Kelola Keuangan Terbuka & Standar PSAK 109',
  },
]

// ===== LEGALITAS DAN AKREDITASI RESMI =====
export const legalitas = [
  {
    title: 'Akreditasi Sekolah',
    value: 'Peringkat A (Unggul)',
    note: 'BAN PAUD & PNF Kemendikbudristek RI',
  },
  {
    title: 'Nomor Pokok Sekolah Nasional (NPSN)',
    value: '69876543',
    note: 'Kementerian Pendidikan Dasar dan Menengah RI',
  },
  {
    title: 'Akta Notaris Pendirian',
    value: 'No. 17 Tanggal 14 April 2016',
    note: 'Notaris Hj. Dewi Lestari, S.H., M.Kn.',
  },
  {
    title: 'SK Kemenkumham RI',
    value: 'AHU-0012345.AH.01.04 Tahun 2016',
    note: 'Direktorat Jenderal Administrasi Hukum Umum',
  },
  {
    title: 'Izin Operasional Lembaga',
    value: 'No. 421.1/234/Disdik/2021',
    note: 'Dinas Pendidikan & Kebudayaan Kota Nusantara',
  },
  {
    title: 'Rekening Resmi Yayasan',
    value: 'Bank Syariah Indonesia (BSI) — 1234-5678-90',
    note: 'a.n. Yayasan Pendidikan Islam Al-Mustam',
  },
  {
    title: 'Nomor Pokok Wajib Pajak (NPWP)',
    value: '01.234.567.8-901.000',
    note: 'KPP Pratama Kota Nusantara (Lembaga Nirlaba Tertib Pajak)',
  },
]

// ===== FASILITAS KAMPUS RAMAH ANAK =====
export const fasilitas = [
  {
    icon: 'mosque',
    title: 'Ruang Kelas Smart & Ber-AC',
    desc: 'Ruang kelas sejuk ber-AC dengan sirkulasi udara alami, smart interactive display, meja kursi ergonomis ramah balita, dan pencahayaan optimal.',
    tag: 'Fasilitas Utama',
  },
  {
    icon: 'quran',
    title: 'Musholla Cilik Al-Mustam',
    desc: 'Musholla bernuansa hangat dengan karpet lembut, tempat wudhu ketinggian khusus anak, sajadah mini, dan pengeras suara lembut.',
    tag: 'Spiritual',
  },
  {
    icon: 'blocks',
    title: 'Playground Outdoor & Sensori Park',
    desc: 'Area bermain luar ruang berlantai karet peredam benturan (*soft flooring*), perosotan, ayunan, jaring panjat, kolam pasir, dan kebun hidroponik.',
    tag: 'Motorik & Fisik',
  },
  {
    icon: 'book',
    title: 'Pojok Literasi & Mini Library',
    desc: 'Koleksi 600+ buku bergambar cerita Islami, pop-up book sirah nabi, ensiklopedia sains anak, dan bean bag santai untuk membaca ceria.',
    tag: 'Literasi',
  },
  {
    icon: 'palette',
    title: 'Ruang Sentra Kreativitas & Musik',
    desc: 'Studio seni ramah anak untuk melukis, melipat origami, bermain alat musik perkusi rebana, angklung cilik, dan panggung dongeng peran.',
    tag: 'Seni & Ekspresi',
  },
  {
    icon: 'users',
    title: 'UKS Ramah Anak & Konsultasi Parenting',
    desc: 'Ruang kesehatan lengkap dengan tim medis dokter mitra berkala, pengukur tumbuh kembang (antropometri), dan ruang temu wali murid.',
    tag: 'Kesehatan',
  },
]
