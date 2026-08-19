// ============================================================
// DONASI & TRANSPARANSI
// Data berikut placeholder — ganti dengan data asli dari backend.
// ============================================================

export type DonationProgram = {
  slug: string
  name: string
  icon: string
  description: string
  color: 'green' | 'blue' | 'gold' | 'red'
}

export const donationPrograms: DonationProgram[] = [
  {
    slug: 'pendidikan-yatim',
    name: 'Pendidikan Yatim',
    icon: 'graduation',
    description: 'Membiayai sekolah, seragam, dan perlengkapan belajar anak yatim.',
    color: 'green',
  },
  {
    slug: 'beasiswa',
    name: 'Beasiswa',
    icon: 'award',
    description: 'Beasiswa prestasi dan keberlanjutan pendidikan bagi anak berprestasi.',
    color: 'blue',
  },
  {
    slug: 'makanan-anak',
    name: 'Makanan Anak',
    icon: 'utensils',
    description: 'Mendukung gizi seimbang melalui program makan sehat harian.',
    color: 'gold',
  },
  {
    slug: 'fasilitas-sekolah',
    name: 'Fasilitas Sekolah',
    icon: 'building',
    description: 'Renovasi dan pengadaan sarana belajar yang nyaman dan aman.',
    color: 'red',
  },
  {
    slug: 'bebas',
    name: 'Bebas',
    icon: 'heart',
    description: 'Donasi tanpa ikatan program, disalurkan sesuai kebutuhan prioritas.',
    color: 'green',
  },
]

export const donationAmounts = [50000, 100000, 250000, 500000, 1000000]

// ===== TRANSPARANSI =====
export type YearReport = {
  year: string
  collected: number
  target: number
  distributed: number
  beneficiaries: number
  months: { month: string; value: number }[]
  distribution: { label: string; value: number; color: string }[]
}

export const donationReports: YearReport[] = [
  {
    year: '2026',
    collected: 487_500_000,
    target: 600_000_000,
    distributed: 402_300_000,
    beneficiaries: 112,
    months: [
      { month: 'Jan', value: 38_000_000 },
      { month: 'Feb', value: 42_500_000 },
      { month: 'Mar', value: 55_000_000 },
      { month: 'Apr', value: 34_000_000 },
      { month: 'Mei', value: 61_000_000 },
      { month: 'Jun', value: 48_000_000 },
      { month: 'Jul', value: 44_000_000 },
      { month: 'Agu', value: 52_000_000 },
      { month: 'Sep', value: 40_000_000 },
      { month: 'Okt', value: 30_000_000 },
      { month: 'Nov', value: 28_000_000 },
      { month: 'Des', value: 15_000_000 },
    ],
    distribution: [
      { label: 'Pendidikan Yatim', value: 41, color: '#124B3A' },
      { label: 'Beasiswa', value: 18, color: '#3D82C6' },
      { label: 'Makanan Anak', value: 22, color: '#F4C542' },
      { label: 'Fasilitas', value: 12, color: '#C94C4C' },
      { label: 'Operasional', value: 7, color: '#8AA79B' },
    ],
  },
  {
    year: '2025',
    collected: 512_400_000,
    target: 500_000_000,
    distributed: 468_900_000,
    beneficiaries: 138,
    months: [
      { month: 'Jan', value: 40_000_000 },
      { month: 'Feb', value: 38_000_000 },
      { month: 'Mar', value: 52_000_000 },
      { month: 'Apr', value: 44_000_000 },
      { month: 'Mei', value: 39_000_000 },
      { month: 'Jun', value: 48_000_000 },
      { month: 'Jul', value: 42_000_000 },
      { month: 'Agu', value: 46_000_000 },
      { month: 'Sep', value: 41_000_000 },
      { month: 'Okt', value: 43_000_000 },
      { month: 'Nov', value: 39_000_000 },
      { month: 'Des', value: 40_400_000 },
    ],
    distribution: [
      { label: 'Pendidikan Yatim', value: 38, color: '#124B3A' },
      { label: 'Beasiswa', value: 16, color: '#3D82C6' },
      { label: 'Makanan Anak', value: 25, color: '#F4C542' },
      { label: 'Fasilitas', value: 14, color: '#C94C4C' },
      { label: 'Operasional', value: 7, color: '#8AA79B' },
    ],
  },
  {
    year: '2024',
    collected: 445_200_000,
    target: 450_000_000,
    distributed: 401_800_000,
    beneficiaries: 121,
    months: [
      { month: 'Jan', value: 34_000_000 },
      { month: 'Feb', value: 36_000_000 },
      { month: 'Mar', value: 45_000_000 },
      { month: 'Apr', value: 38_000_000 },
      { month: 'Mei', value: 40_000_000 },
      { month: 'Jun', value: 35_000_000 },
      { month: 'Jul', value: 39_000_000 },
      { month: 'Agu', value: 37_000_000 },
      { month: 'Sep', value: 36_000_000 },
      { month: 'Okt', value: 35_000_000 },
      { month: 'Nov', value: 33_000_000 },
      { month: 'Des', value: 37_200_000 },
    ],
    distribution: [
      { label: 'Pendidikan Yatim', value: 39, color: '#124B3A' },
      { label: 'Beasiswa', value: 15, color: '#3D82C6' },
      { label: 'Makanan Anak', value: 24, color: '#F4C542' },
      { label: 'Fasilitas', value: 13, color: '#C94C4C' },
      { label: 'Operasional', value: 9, color: '#8AA79B' },
    ],
  },
]

// ============================================================
// DATA ADMIN (placeholder — siap diintegrasikan ke backend)
// ============================================================

export const adminStats = [
  { label: 'Total Siswa', value: 152, delta: '+8%', icon: 'users' },
  { label: 'Pendaftar Baru', value: 24, delta: '+12%', icon: 'file' },
  { label: 'Anak Yatim', value: 32, delta: '+3', icon: 'heart' },
  { label: 'Total Donasi', value: 'Rp 487,5 jt', delta: '+9%', icon: 'wallet' },
]

export const adminPpdb = [
  { id: 'PPDB-2026-001', name: 'Muhammad Rizky Ramadhan', program: 'TK A', date: '08 Agu 2026', status: 'Diterima' },
  { id: 'PPDB-2026-002', name: 'Aisyah Putri Humaira', program: 'KB', date: '07 Agu 2026', status: 'Wawancara' },
  { id: 'PPDB-2026-003', name: 'Ahmad Fathan Alfarizi', program: 'TK B', date: '06 Agu 2026', status: 'Verifikasi' },
  { id: 'PPDB-2026-004', name: 'Salsabila Nur Aini', program: 'TPA', date: '05 Agu 2026', status: 'Diterima' },
  { id: 'PPDB-2026-005', name: 'Yusuf Abdullah Maulana', program: 'TK A', date: '04 Agu 2026', status: 'Baru' },
  { id: 'PPDB-2026-006', name: 'Khadijah Az-Zahra', program: 'KB', date: '03 Agu 2026', status: 'Wawancara' },
]

export const adminDonations = [
  { id: 'DON-2608-01', donor: 'Hendra Wijaya', program: 'Pendidikan Yatim', amount: 2500000, date: '09 Agu 2026', status: 'Tersalur' },
  { id: 'DON-2608-02', donor: 'Ibu Rahma Sari', program: 'Makanan Anak', amount: 500000, date: '09 Agu 2026', status: 'Terkumpul' },
  { id: 'DON-2608-03', donor: 'Bapak Dimas Pratama', program: 'Beasiswa', amount: 1000000, date: '08 Agu 2026', status: 'Terkumpul' },
  { id: 'DON-2608-04', donor: 'Anonim', program: 'Bebas', amount: 150000, date: '08 Agu 2026', status: 'Tersalur' },
  { id: 'DON-2608-05', donor: 'PT Berkah Sejahtera', program: 'Fasilitas Sekolah', amount: 10000000, date: '07 Agu 2026', status: 'Terkumpul' },
]

export const adminChart = {
  pendaftaran: [
    { month: 'Mar', value: 6 },
    { month: 'Apr', value: 9 },
    { month: 'Mei', value: 12 },
    { month: 'Jun', value: 10 },
    { month: 'Jul', value: 18 },
    { month: 'Agu', value: 24 },
  ],
  donasiPerBulan: [
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 44 },
    { month: 'Mei', value: 52 },
    { month: 'Jun', value: 48 },
    { month: 'Jul', value: 55 },
    { month: 'Agu', value: 61 },
  ],
  programAktif: [
    { label: 'Pendidikan Yatim', value: 41, color: '#124B3A' },
    { label: 'Beasiswa', value: 18, color: '#3D82C6' },
    { label: 'Makanan Anak', value: 22, color: '#F4C542' },
    { label: 'Fasilitas', value: 12, color: '#C94C4C' },
    { label: 'Operasional', value: 7, color: '#8AA79B' },
  ],
}
