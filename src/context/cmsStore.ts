import { createContext, useContext } from 'react'
import type {
  CMSData,
  SiteData,
  NewsItem,
  ProgramItem,
  TeacherItem,
  GalleryItem,
  PPDBApplicant,
  PPDBBatch,
  OrphanBeneficiary,
  DonationItem,
  FacilityItem,
  PageContent,
  DoaItem,
  IslamicArticle,
} from '../types/cms'
import { site as initialSite } from '../data/site'
import { news as initialNews } from '../data/news'
import { programs as initialPrograms } from '../data/programs'
import { gallery as initialGallery } from '../data/gallery'
import { organization, fasilitas, pillars as initialPillars, doas, islamicArticles } from '../data/content'

export const STORAGE_KEY = 'WEBMUSTAM_CMS_DATA_V1'

export const initialCMSData: CMSData = {
  site: {
    ...initialSite,
    bank: {
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '1234-5678-90',
      accountHolder: 'Yayasan Pendidikan Islam Al-Mustam',
    },
  },
  news: initialNews,
  programs: initialPrograms.map((p) => {
    const fees: Record<string, { monthly: number; entry: number }> = {
      kb: { monthly: 250000, entry: 2500000 },
      'tk-a': { monthly: 300000, entry: 3200000 },
      'tk-b': { monthly: 320000, entry: 3500000 },
      tpa: { monthly: 150000, entry: 500000 },
    }
    return {
      ...p,
      monthlyFee: fees[p.slug]?.monthly ?? 300000,
      entryFee: fees[p.slug]?.entry ?? 3000000,
    }
  }),
  teachers: organization.map((o, idx) => ({
    id: `guru-${idx + 1}`,
    name: o.name,
    role: o.role,
    note: o.note,
    education: o.note.includes('S1') ? 'S1 PAUD' : o.note.includes('M.') ? 'S2 Pendidikan' : 'Sarjana',
  })),
  gallery: initialGallery,
  doas,
  islamicArticles,
  pageContent: {
    hero: {
      eyebrow: `Terakreditasi A · NPSN: ${initialSite.npsn}`,
      title: 'Membentuk Generasi',
      highlight: 'Qur’ani',
      titleSuffix: 'Beradab, & Cerdas Holistik.',
      description:
        'Lingkungan belajar anak usia dini melalui Kurikulum Merdeka PAUD, metode 5 Sentra (BCCT), Tahfidz Juz 30, dan pembiasaan karakter Islami.',
      image: '/images/content/hero-school.jpg',
      imageAlt: 'Kegiatan belajar anak bersama guru di TK Islam Al-Mustam',
      primaryLabel: 'Daftar PPDB',
      benefits: [
        'Pendampingan kelompok belajar sesuai usia',
        'Metode 5 Sentra (BCCT) & Kurikulum Merdeka',
        'Tahfidz Juz 30 metode Tilawati ramah anak',
        'Jalur bantuan pendidikan yatim dan dhuafa',
      ],
    },
    welcome: {
      eyebrow: 'Sambutan Kepala Sekolah',
      title: 'Mendampingi Anak Tumbuh dengan Iman, Adab, dan Rasa Ingin Tahu',
      quote: 'Setiap anak adalah amanah yang bertumbuh melalui keteladanan, kasih sayang, dan pembiasaan baik setiap hari.',
      body: 'Kami membangun lingkungan belajar yang hangat, aman, dan dekat dengan keluarga agar anak berani mencoba, senang belajar, serta terbiasa berbuat baik.',
      personName: 'Ustadzah Siti Maryam, S.Pd. PAUD',
      personRole: 'Kepala TK Islam Al-Mustam',
      image: '/images/content/ketua-yayasan.jpg',
      imageAlt: 'Kepala TK Islam Al-Mustam',
    },
    ppdb: {
      academicYear: '2026/2027',
      registrationOpen: true,
      closedMessage:
        'Pendaftaran peserta didik baru saat ini sedang ditutup. Silakan hubungi sekretariat melalui WhatsApp untuk informasi daftar tunggu.',
      waves: [
        {
          id: 'gelombang-1',
          name: 'Gelombang 1 (Early Bird & Beasiswa Yatim)',
          period: '1 Januari – 30 April 2026',
          quota: 'Sesuai kuota rombel',
          status: 'OPEN',
          description: 'Penerimaan peserta didik baru gelombang pertama dan seleksi jalur bantuan pendidikan yatim.',
        },
        {
          id: 'gelombang-2',
          name: 'Gelombang 2 (Reguler)',
          period: '1 Mei – 10 Juli 2026',
          quota: 'Sesuai ketersediaan rombel',
          status: 'UPCOMING',
          description: 'Penerimaan siswa reguler untuk tahun ajaran baru 2026/2027.',
        },
      ],
      title: 'Bergabung Bersama Keluarga Besar TK Islam Al-Mustam',
      description: 'Penerimaan peserta didik baru untuk KB, TK A, TK B, dan TPA Tahfidz.',
      notice: 'Pendaftaran diproses sesuai ketersediaan kuota pada gelombang aktif.',
      requirements: [
        'Salinan Kartu Keluarga (KK)',
        'Salinan Akta Kelahiran Anak',
        'Salinan KTP Orang Tua / Wali',
        'Pas foto berwarna anak ukuran 3×4',
        'Catatan riwayat kesehatan / imunisasi (opsional)',
      ],
    },
    profile: {
      title: 'Pendidikan Anak Usia Dini Berakar Karakter Qur’ani',
      description:
        "TK Islam Al-Mustam berdiri dengan komitmen melahirkan generasi muslim cilik yang beradab, mencintai Al-Qur'an, mandiri, dan senang belajar.",
      aboutParagraph1:
        'TK Islam Al-Mustam didirikan untuk menghadirkan lingkungan belajar anak usia dini yang sehat, hangat, dan terarah. Kami menaungi program Kelompok Bermain (KB), Taman Kanak-Kanak (TK A & TK B), TPA Tahfidz Cilik, serta jalur bantuan pendidikan yatim dan dhuafa.',
      aboutParagraph2:
        'Kurikulum kami memadukan Kurikulum Merdeka PAUD dengan metode 5 Sentra (BCCT) dan 7 Pilar Karakter Islami agar potensi nilai agama, motorik, kognitif, bahasa, dan sosial-emosional anak berkembang sesuai tahapan usianya.',
      image: '/images/content/hero-school.jpg',
      imageAlt: 'Gedung TK Islam Al-Mustam',
    },
    visionMission: {
      visionText:
        'Menjadi lembaga pendidikan Islam yang melahirkan generasi Qur’ani, beradab, berakhlaqul karimah, dan cerdas holistik bersama keluarga dan masyarakat.',
      missionList: [
        'Menyelenggarakan pendidikan anak usia dini berpusat pada anak dengan pendekatan kasih sayang dan keteladanan.',
        'Menanamkan aqidah, pembiasaan sholat dhuha, tahfidz Juz 30, serta hafalan doa harian sejak dini.',
        'Mengembangkan potensi kognitif, kemandirian motorik, dan kepekaan sosial secara berimbang.',
        'Menyelenggarakan jalur pengajuan bantuan pendidikan bagi anak yatim dan keluarga yang membutuhkan sesuai ketentuan program.',
        'Membangun kemitraan harmonis dan terbuka dengan orang tua sebagai pendidik utama anak.',
      ],
    },
    sejarah: {
      milestones: [
        {
          year: '2012',
          title: 'Majelis Taklim & TPQ Lingkungan',
          desc: 'Kegiatan belajar baca-tulis Al-Qur’an dan pembiasaan doa harian dimulai bagi anak-anak di lingkungan sekitar.',
        },
        {
          year: '2016',
          title: 'Pendirian Resmi Yayasan Al-Mustam',
          desc: 'Yayasan resmi berbadan hukum melalui akta notaris dan SK Kemenkumham RI untuk memperkuat tata kelola lembaga.',
        },
        {
          year: '2018',
          title: 'Pembukaan Kelompok Bermain (Playgroup / KB)',
          desc: 'KB dibuka untuk melayani anak usia 3–4 tahun dengan metode stimulasi sensori-motorik dan pembiasaan doa harian.',
        },
        {
          year: '2020',
          title: 'Penyelenggaraan TK Islam Al-Mustam (TK A & TK B)',
          desc: 'Menerapkan Kurikulum Merdeka PAUD yang terintegrasi muatan diniyah dan metode 5 Sentra (BCCT).',
        },
        {
          year: '2026',
          title: 'Integrasi Layanan Digital Akademik & PPDB',
          desc: 'Penerapan sistem informasi pendaftaran peserta didik baru, pemantauan tumbuh kembang, dan publikasi kegiatan sekolah.',
        },
      ],
    },
  },
  ppdbApplicants: [],
  ppdbBatches: [],
  orphans: [],
  donations: [],
  facilities: fasilitas.map((f, idx) => ({
    id: `fac-${idx + 1}`,
    icon: f.icon,
    title: f.title,
    desc: f.desc,
    tag: f.tag,
  })),
  pillars: initialPillars,
  faqs: [
    {
      id: 'faq-1',
      category: 'PPDB',
      question: 'Berapa usia minimal untuk mendaftar Playgroup (KB) dan TK A?',
      answer:
        'Untuk Playgroup (KB) minimal usia 3 tahun pada bulan Juli tahun berjalan. Untuk TK A minimal usia 4 tahun, dan TK B minimal 5 tahun.',
    },
    {
      id: 'faq-2',
      category: 'PPDB',
      question: 'Apakah ada bantuan pendidikan untuk anak yatim dan dhuafa?',
      answer:
        'Yayasan Al-Mustam menyediakan jalur pengajuan bantuan pendidikan bagi murid yatim dan dhuafa yang lolos verifikasi dokumen sekretariat.',
    },
    {
      id: 'faq-3',
      category: 'Kurikulum',
      question: 'Metode apa yang digunakan dalam pembelajaran Al-Qur’an?',
      answer:
        'Kami menggunakan metode Tilawati yang dipadukan dengan pendekatan 5 Sentra (BCCT) ramah anak.',
    },
  ],
  lastUpdated: new Date().toISOString(),
}

export type ToastNotification = {
  id: string
  type: 'success' | 'info' | 'error'
  message: string
}

export type CMSContextType = {
  data: CMSData
  isLoggedIn: boolean
  login: (usernameOrPin: string, password?: string) => boolean
  logout: () => void
  toasts: ToastNotification[]
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void
  removeToast: (id: string) => void

  updateSite: (partial: Partial<SiteData>) => void
  updatePageContent: <K extends keyof PageContent>(section: K, partial: Partial<PageContent[K]>) => void

  addNews: (item: NewsItem) => void
  updateNews: (slug: string, item: Partial<NewsItem>) => void
  deleteNews: (slug: string) => void

  updateProgram: (slug: string, item: Partial<ProgramItem>) => void

  addTeacher: (item: Omit<TeacherItem, 'id'>) => void
  updateTeacher: (id: string, item: Partial<TeacherItem>) => void
  deleteTeacher: (id: string) => void

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void
  updateGalleryItem: (id: number, item: Partial<GalleryItem>) => void
  deleteGalleryItem: (id: number) => void

  addDoa: (item: DoaItem) => void
  updateDoa: (slug: string, item: Partial<DoaItem>) => void
  deleteDoa: (slug: string) => void

  addIslamicArticle: (item: IslamicArticle) => void
  updateIslamicArticle: (slug: string, item: Partial<IslamicArticle>) => void
  deleteIslamicArticle: (slug: string) => void

  addPPDBApplicant: (
    applicant: Omit<PPDBApplicant, 'id' | 'date' | 'status'> & { id?: string; status?: PPDBApplicant['status'] }
  ) => string
  updatePPDBApplicantStatus: (id: string, status: PPDBApplicant['status']) => void
  deletePPDBApplicant: (id: string) => void
  updatePPDBBatch: (id: string, item: Partial<PPDBBatch>) => void

  addOrphan: (item: Omit<OrphanBeneficiary, 'id'>) => void
  updateOrphan: (id: string, item: Partial<OrphanBeneficiary>) => void
  deleteOrphan: (id: string) => void
  addDonation: (item: Omit<DonationItem, 'id' | 'date'>) => void
  updateDonationStatus: (id: string, status: DonationItem['status']) => void

  addFacility: (item: Omit<FacilityItem, 'id'>) => void
  updateFacility: (id: string, item: Partial<FacilityItem>) => void
  deleteFacility: (id: string) => void

  exportBackup: () => void
  importBackup: (jsonString: string) => boolean
  resetToDefaults: () => void
}

export const CMSContext = createContext<CMSContextType | null>(null)

export function useCMS() {
  const ctx = useContext(CMSContext)
  if (!ctx) {
    throw new Error('useCMS must be used within a CMSProvider')
  }
  return ctx
}
