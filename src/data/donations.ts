// ============================================================
// PROGRAM DUKUNGAN PENDIDIKAN YATIM & DHUAFA
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
    description: 'Dukungan biaya sekolah, seragam, dan perlengkapan belajar peserta didik yatim.',
    color: 'green',
  },
  {
    slug: 'beasiswa',
    name: 'Beasiswa Dhuafa',
    icon: 'award',
    description: 'Keringanan biaya pendidikan bagi peserta didik dari keluarga yang membutuhkan.',
    color: 'blue',
  },
  {
    slug: 'makanan-anak',
    name: 'Gizi & Bekal Sehat',
    icon: 'utensils',
    description: 'Mendukung program makan bersama dan kudapan sehat terjadwal di sekolah.',
    color: 'gold',
  },
  {
    slug: 'fasilitas-sekolah',
    name: 'Sarana Belajar',
    icon: 'building',
    description: 'Pemeliharaan dan pengadaan alat peraga edukatif sentra serta buku bacaan anak.',
    color: 'red',
  },
]
