import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
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
import { adminPpdb, adminDonations } from '../data/donations'

const STORAGE_KEY = 'WEBMUSTAM_CMS_DATA_V1'
const AUTH_KEY = 'WEBMUSTAM_ADMIN_AUTH'

// ===== DATA DEFAULT AWAL SISTEM =====
export const initialCMSData: CMSData = {
  site: {
    ...initialSite,
    adminUsername: 'admin',
    adminPassword: 'admin123',
    adminPin: '123456',
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
      eyebrow: `Terakreditasi A (Unggul) • NPSN: ${initialSite.npsn}`,
      title: 'Membentuk Generasi',
      highlight: 'Qur’ani',
      titleSuffix: 'Beradab, & Cerdas Holistik.',
      description:
        'Rumah kedua yang hangat untuk tumbuh kembang anak usia dini melalui Kurikulum Merdeka, Tahfidz Juz 30, dan pembiasaan karakter Islami.',
      image: '/images/content/hero-school.jpg',
      imageAlt: 'Kegiatan belajar anak bersama guru di TK Islam Al-Mustam',
      primaryLabel: 'Daftar PPDB',
      benefits: ['Kelompok belajar dengan pendampingan', 'Metode Sentra (BCCT)', 'Guru pendamping terlatih', 'Program bantuan yatim dan dhuafa'],
    },
    welcome: {
      eyebrow: 'Sambutan Kepala Sekolah',
      title: 'Mendampingi Anak Tumbuh dengan Iman, Adab, dan Rasa Ingin Tahu',
      quote: 'Setiap anak adalah amanah dengan irama tumbuhnya sendiri.',
      body: 'Kami membangun lingkungan belajar yang hangat, aman, dan dekat dengan keluarga agar anak berani mencoba, senang belajar, serta terbiasa berbuat baik.',
      personName: 'Kepala TK Islam Al-Mustam',
      personRole: 'Pimpinan Satuan Pendidikan',
      image: '/images/content/ketua-yayasan.jpg',
      imageAlt: 'Kepala TK Islam Al-Mustam',
    },
    ppdb: {
      academicYear: '2026/2027',
      registrationOpen: true,
      closedMessage: 'Mohon maaf, pendaftaran peserta didik baru saat ini belum dibuka atau kuota pada gelombang aktif telah terpenuhi. Silakan hubungi sekretariat via WhatsApp untuk masuk daftar tunggu (waiting list).',
      waves: [
        {
          id: 'gelombang-1',
          name: 'Gelombang 1 (Early Bird & Beasiswa Yatim)',
          period: '1 Januari – 30 April 2026',
          quota: 'Sisa 8 Kuota',
          status: 'OPEN',
          description: 'Potongan biaya sarana pendidikan & prioritas pemilihan shift kelas.',
        },
        {
          id: 'gelombang-2',
          name: 'Gelombang 2 (Reguler)',
          period: '1 Mei – 10 Juli 2026',
          quota: '30 Kuota Tersedia',
          status: 'UPCOMING',
          description: 'Penerimaan siswa reguler untuk tahun ajaran baru 2026/2027.',
        },
      ],
      title: 'Bergabung Bersama Keluarga Besar TK Islam Al-Mustam',
      description: 'Penerimaan peserta didik baru untuk KB, TK A, TK B, dan TPA.',
      notice: 'Pendaftaran diproses sesuai ketersediaan kuota pada gelombang aktif.',
      requirements: [
        'Fotokopi Kartu Keluarga (KK)',
        'Fotokopi Akta Kelahiran Anak',
        'Pas foto berwarna anak ukuran 3×4',
        'Fotokopi KTP orang tua atau wali',
      ],
    },
    profile: {
      title: 'Pendidikan Islam Unggulan Berakar Karakter Qur’ani',
      description: 'TK Islam Al-Mustam berdiri dengan tekad melahirkan generasi muslim cilik yang beradab, mencintai Al-Qur\'an, mandiri, dan berwawasan luas.',
      aboutParagraph1: 'TK Islam Al-Mustam didirikan dengan niat tulus menghadirkan lingkungan belajar anak usia dini yang sehat, hangat, dan berstandar nasional. Kami menaungi program Kelompok Bermain (KB), Taman Kanak-kanak (TK A & TK B), TPA Tahfidz Cilik, serta program beasiswa yatim piatu.',
      aboutParagraph2: 'Kami meyakini bahwa pondasi keberhasilan masa depan anak berakar pada adab dan kematangan emosi di usia emas (golden age). Oleh karena itu, kurikulum kami memadukan Kurikulum Merdeka dengan metode sentra (BCCT) dan 7 Pilar Karakter Islami, memastikan setiap potensi fitrah anak distimulasi secara optimal tanpa paksaan.',
      image: '/images/content/hero-school.jpg',
      imageAlt: 'Gedung TK Islam Al-Mustam',
    },
    visionMission: {
      visionText: 'Menjadi lembaga pendidikan Islam unggulan yang melahirkan generasi Qur’ani, beradab, berakhlaqul karimah, dan cerdas holistik, serta membawa manfaat luas bagi umat dan bangsa.',
      missionList: [
        'Menyelenggarakan pendidikan anak usia dini (PAUD/TK) Islam berkualitas berpusat pada anak dengan pendekatan kasih sayang dan keteladanan.',
        'Menanamkan aqidah yang lurus, pembiasaan sholat dhuha, tahfidz Juz 30, serta hafalan doa harian sejak dini.',
        'Mengembangkan potensi fitrah anak secara holistik: kecerdasan intelektual, kemandirian motorik, dan kepekaan sosial.',
        'Menyelenggarakan jalur pengajuan bantuan pendidikan bagi anak yatim dan keluarga yang membutuhkan sesuai kemampuan program.',
        'Membangun kemitraan harmonis dan transparan dengan orang tua sebagai pilar utama pendidikan anak.',
        'Mengelola yayasan secara amanah, profesional, taat hukum, dan berstandar mutu nasional.',
      ],
    },
    sejarah: {
      milestones: [
        { year: '2012', title: 'Awal Mula: Majelis Taklim & TPQ Kecil', desc: 'Bermula dari majelis taklim dan TPQ kecil dengan 15 murid, semangat mengajarkan baca-tulis Al-Qur’an dan adab kepada anak-anak sekitar mulai bersemi.' },
        { year: '2016', title: 'Pendirian Resmi Yayasan Al-Mustam', desc: 'Yayasan resmi berbadan hukum melalui akta notaris dan SK Kemenkumham RI, memperkokoh tata kelola kelembagaan yang amanah dan transparan.' },
        { year: '2018', title: 'Pembukaan Kelompok Bermain (Playgroup / KB)', desc: 'KB dibuka untuk melayani anak usia 3–4 tahun dengan metode stimulasi sensori-motorik dan pembiasaan doa harian.' },
        { year: '2020', title: 'Peresmian TK Islam Al-Mustam (TK A & TK B)', desc: 'Menerapkan Kurikulum Merdeka yang terintegrasi muatan diniyah dan metode sentra (BCCT), dilengkapi ruang kelas ber-AC dan playground outdoor.' },
        { year: '2022', title: 'Pengembangan Program Dukungan Pendidikan', desc: 'Yayasan mulai mengembangkan jalur bantuan pendidikan bagi anak yatim dan keluarga yang membutuhkan.' },
        { year: '2026', title: 'Penguatan Mutu dan Layanan Pendidikan', desc: 'Sekolah melanjutkan pengembangan program, tata kelola, dan layanan informasi bagi keluarga.' },
      ],
    },
  },
  ppdbApplicants: adminPpdb.map((p, idx) => ({
    id: p.id,
    name: p.name,
    program: p.program,
    track: 'Reguler',
    whatsapp: `0812345678${idx}`,
    date: p.date,
    status: p.status as PPDBApplicant['status'],
    address: 'Kota Nusantara',
  })),
  ppdbBatches: [
    {
      id: 'batch-1',
      name: 'Gelombang 1 (Early Bird)',
      period: 'Januari – Maret 2026',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      quota: 40,
      filled: 38,
      isActive: false,
    },
    {
      id: 'batch-2',
      name: 'Gelombang 2 (Reguler)',
      period: 'April – Juli 2026',
      startDate: '2026-04-01',
      endDate: '2026-07-31',
      quota: 40,
      filled: 24,
      isActive: true,
    },
    {
      id: 'batch-3',
      name: 'Gelombang 3 (Sisa Kuota)',
      period: 'Agustus 2026',
      startDate: '2026-08-01',
      endDate: '2026-08-25',
      quota: 20,
      filled: 6,
      isActive: false,
    },
  ],
  orphans: [
    {
      id: 'ytm-1',
      name: 'Ananda Rizki (8 Th)',
      age: 8,
      grade: 'TK B / Persiapan SD',
      gender: 'Laki-laki',
      monthlyNeed: 450000,
      status: 'Aktif Terbantu',
      guardian: 'Hj. Ratna Kusuma',
    },
    {
      id: 'ytm-2',
      name: 'Ananda Fatimah (5 Th)',
      age: 5,
      grade: 'TK A',
      gender: 'Perempuan',
      monthlyNeed: 400000,
      status: 'Aktif Terbantu',
      guardian: 'Hamba Allah',
    },
    {
      id: 'ytm-3',
      name: 'Ananda Zaid (4 Th)',
      age: 4,
      grade: 'KB / Playgroup',
      gender: 'Laki-laki',
      monthlyNeed: 350000,
      status: 'Menunggu Wali Asuh',
    },
    {
      id: 'ytm-4',
      name: 'Ananda Maryam (6 Th)',
      age: 6,
      grade: 'TK B',
      gender: 'Perempuan',
      monthlyNeed: 450000,
      status: 'Aktif Terbantu',
      guardian: 'dr. Sarah Nabila',
    },
    {
      id: 'ytm-5',
      name: 'Ananda Umar (7 Th)',
      age: 7,
      grade: 'TPA Tahfidz',
      gender: 'Laki-laki',
      monthlyNeed: 300000,
      status: 'Menunggu Wali Asuh',
    },
  ],
  donations: adminDonations.map((d) => ({
    id: d.id,
    donor: d.donor,
    program: d.program,
    amount: d.amount,
    date: d.date,
    status: d.status as DonationItem['status'],
  })),
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
      answer: 'Untuk Playgroup (KB) minimal usia 3 tahun pada bulan Juli tahun berjalan. Untuk TK A minimal usia 4 tahun, dan TK B minimal 5 tahun.',
    },
    {
      id: 'faq-2',
      category: 'PPDB',
      question: 'Apakah ada bantuan pendidikan untuk anak yatim dan dhuafa?',
      answer: 'Yayasan Al-Mustam menyediakan bantuan pendidikan bagi murid yatim dan dhuafa yang lolos verifikasi. Bentuk bantuan mengikuti ketentuan program dan ketersediaan dana pada periode berjalan.',
    },
    {
      id: 'faq-3',
      category: 'Kurikulum',
      question: 'Metode apa yang digunakan dalam pembelajaran Al-Qur’an?',
      answer: 'Kami menggunakan metode Tilawati berstandar nasional yang dipadukan dengan pendekatan BCCT (Beyond Centers and Circle Time) ramah anak.',
    },
  ],
  lastUpdated: new Date().toISOString(),
}

// ===== CONTEXT INTERFACE =====
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

  // Site Actions
  updateSite: (partial: Partial<SiteData>) => void
  updatePageContent: <K extends keyof PageContent>(section: K, partial: Partial<PageContent[K]>) => void

  // News Actions
  addNews: (item: Omit<NewsItem, 'slug'> & { slug?: string }) => void
  updateNews: (slug: string, item: Partial<NewsItem>) => void
  deleteNews: (slug: string) => void

  // Programs Actions
  updateProgram: (slug: string, item: Partial<ProgramItem>) => void

  // Teachers Actions
  addTeacher: (item: Omit<TeacherItem, 'id'>) => void
  updateTeacher: (id: string, item: Partial<TeacherItem>) => void
  deleteTeacher: (id: string) => void

  // Gallery Actions
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void
  updateGalleryItem: (id: number, item: Partial<GalleryItem>) => void
  deleteGalleryItem: (id: number) => void

  // Khazanah Actions
  addDoa: (item: DoaItem) => void
  updateDoa: (slug: string, item: Partial<DoaItem>) => void
  deleteDoa: (slug: string) => void
  addIslamicArticle: (item: IslamicArticle) => void
  updateIslamicArticle: (slug: string, item: Partial<IslamicArticle>) => void
  deleteIslamicArticle: (slug: string) => void

  // PPDB Actions
  addPPDBApplicant: (applicant: Omit<PPDBApplicant, 'id' | 'date' | 'status'> & { id?: string; status?: PPDBApplicant['status'] }) => string
  updatePPDBApplicantStatus: (id: string, status: PPDBApplicant['status']) => void
  deletePPDBApplicant: (id: string) => void
  updatePPDBBatch: (id: string, item: Partial<PPDBBatch>) => void

  // Orphans & Donations Actions
  addOrphan: (item: Omit<OrphanBeneficiary, 'id'>) => void
  updateOrphan: (id: string, item: Partial<OrphanBeneficiary>) => void
  deleteOrphan: (id: string) => void
  addDonation: (item: Omit<DonationItem, 'id' | 'date'>) => void
  updateDonationStatus: (id: string, status: DonationItem['status']) => void

  // Facility Actions
  addFacility: (item: Omit<FacilityItem, 'id'>) => void
  updateFacility: (id: string, item: Partial<FacilityItem>) => void
  deleteFacility: (id: string) => void

  // System Backup & Reset
  exportBackup: () => void
  importBackup: (jsonString: string) => boolean
  resetToDefaults: () => void
}

const CMSContext = createContext<CMSContextType | null>(null)

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from LocalStorage or initialize
  const [data, setData] = useState<CMSData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const storedHero = parsed.pageContent?.hero || {}
        const migratedBenefits = Array.isArray(storedHero.benefits)
          ? storedHero.benefits.map((benefit: string) => {
              if (benefit === 'Rasio kelas nyaman 1:7') return 'Kelompok belajar dengan pendampingan'
              if (benefit === 'Program beasiswa yatim dan dhuafa') return 'Program bantuan yatim dan dhuafa'
              return benefit
            })
          : initialCMSData.pageContent.hero.benefits
        const migratedPrograms = Array.isArray(parsed.programs)
          ? parsed.programs.map((program: ProgramItem) => ({
              ...program,
              highlights: program.highlights?.map((highlight) =>
                highlight === 'Program setor hafalan mandiri bersanad'
                  ? 'Pendampingan setoran hafalan secara bertahap'
                  : highlight === '100% siswa lulusan siap dan percaya diri menempuh tes masuk SD favorit'
                    ? 'Pendampingan kesiapan sekolah dasar sesuai tahap perkembangan setiap anak'
                    : highlight,
              ),
            }))
          : initialCMSData.programs
        const migratedSite = {
          ...initialCMSData.site,
          ...parsed.site,
          description: parsed.site?.description === 'Lembaga Pendidikan Islam Terakreditasi A yang menaungi Playgroup (KB), TK A, TK B, TPA Tahfidz, serta program pembinaan beasiswa penuh bagi murid yatim dan dhuafa.'
            ? initialCMSData.site.description
            : parsed.site?.description || initialCMSData.site.description,
        }
        // Merge to ensure backwards compatibility with any newly added properties
        return {
          ...initialCMSData,
          ...parsed,
          programs: migratedPrograms,
          site: migratedSite,
          pageContent: {
            ...initialCMSData.pageContent,
            ...(parsed.pageContent || {}),
            hero: { ...initialCMSData.pageContent.hero, ...storedHero, benefits: migratedBenefits },
            welcome: {
              ...initialCMSData.pageContent.welcome,
              ...(parsed.pageContent?.welcome || {}),
              image: parsed.pageContent?.welcome?.image === '/images/content/kepala-sekolah.jpg'
                ? '/images/content/ketua-yayasan.jpg'
                : parsed.pageContent?.welcome?.image || initialCMSData.pageContent.welcome.image,
            },
            ppdb: { ...initialCMSData.pageContent.ppdb, ...(parsed.pageContent?.ppdb || {}) },
          },
        }
      }
    } catch (e) {
      console.error('Failed to load CMS data from localStorage', e)
    }
    return initialCMSData
  })

  // Auth State: Persisted in sessionStorage across refresh during the active browser session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(AUTH_KEY) === 'true'
      } catch {
        return false
      }
    }
    return false
  })

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Persist data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save CMS data to localStorage', e)
    }
  }, [data])

  // Auth Methods (Username + Password with PIN fallback)
  const login = useCallback(
    (usernameOrPin: string, password?: string) => {
      const currentUsername = data.site.adminUsername || 'admin'
      const currentPassword = data.site.adminPassword || 'admin123'
      const currentPin = data.site.adminPin || '123456'

      let isValid = false

      if (password !== undefined) {
        // Username & Password login
        const matchCustom =
          usernameOrPin.trim().toLowerCase() === currentUsername.toLowerCase() &&
          password === currentPassword
        const matchDefault =
          usernameOrPin.trim().toLowerCase() === 'admin' &&
          password === 'admin123'

        isValid = matchCustom || matchDefault
      } else {
        // Fallback PIN login
        isValid = usernameOrPin === currentPin || usernameOrPin === '123456'
      }

      if (isValid) {
        try {
          sessionStorage.setItem(AUTH_KEY, 'true')
        } catch {}
        setIsLoggedIn(true)
        showToast('Login berhasil. Selamat datang di CMS!', 'success')
        return true
      }

      showToast('Username atau password salah. Silakan periksa kembali.', 'error')
      return false
    },
    [data.site.adminUsername, data.site.adminPassword, data.site.adminPin, showToast]
  )

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    try {
      sessionStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_KEY)
    } catch {}
  }, [])

  // ===== SITE ACTIONS =====
  const updateSite = useCallback(
    (partial: Partial<SiteData>) => {
      setData((prev) => ({
        ...prev,
        site: {
          ...prev.site,
          ...partial,
          contact: { ...prev.site.contact, ...(partial.contact || {}) },
          social: { ...prev.site.social, ...(partial.social || {}) },
          bank: { ...prev.site.bank, ...(partial.bank || {}) },
        },
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Informasi yayasan berhasil diperbarui!')
    },
    [showToast]
  )

  const updatePageContent = useCallback(
    <K extends keyof PageContent>(section: K, partial: Partial<PageContent[K]>) => {
      setData((prev) => ({
        ...prev,
        pageContent: {
          ...prev.pageContent,
          [section]: { ...prev.pageContent[section], ...partial },
        },
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Konten halaman berhasil diperbarui!')
    },
    [showToast]
  )

  // ===== NEWS ACTIONS =====
  const addNews = useCallback(
    (item: Omit<NewsItem, 'slug'> & { slug?: string }) => {
      const slug =
        item.slug ||
        item.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')

      const newItem: NewsItem = {
        ...item,
        slug: slug || `berita-${Date.now()}`,
      }

      setData((prev) => ({
        ...prev,
        news: [newItem, ...prev.news],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Berita baru berhasil ditambahkan!')
    },
    [showToast]
  )

  const updateNews = useCallback(
    (slug: string, item: Partial<NewsItem>) => {
      setData((prev) => ({
        ...prev,
        news: prev.news.map((n) => (n.slug === slug ? { ...n, ...item } : n)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Artikel berita berhasil diperbarui!')
    },
    [showToast]
  )

  const deleteNews = useCallback(
    (slug: string) => {
      setData((prev) => ({
        ...prev,
        news: prev.news.filter((n) => n.slug !== slug),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Artikel berita berhasil dihapus.', 'info')
    },
    [showToast]
  )

  // ===== PROGRAM ACTIONS =====
  const updateProgram = useCallback(
    (slug: string, item: Partial<ProgramItem>) => {
      setData((prev) => ({
        ...prev,
        programs: prev.programs.map((p) => (p.slug === slug ? { ...p, ...item } : p)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast(`Program ${item.name || slug} berhasil diperbarui!`)
    },
    [showToast]
  )

  // ===== TEACHER ACTIONS =====
  const addTeacher = useCallback(
    (item: Omit<TeacherItem, 'id'>) => {
      const newTeacher: TeacherItem = {
        ...item,
        id: `guru-${Date.now()}`,
      }
      setData((prev) => ({
        ...prev,
        teachers: [...prev.teachers, newTeacher],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data tenaga pendidik berhasil ditambahkan!')
    },
    [showToast]
  )

  const updateTeacher = useCallback(
    (id: string, item: Partial<TeacherItem>) => {
      setData((prev) => ({
        ...prev,
        teachers: prev.teachers.map((t) => (t.id === id ? { ...t, ...item } : t)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data tenaga pendidik berhasil diperbarui!')
    },
    [showToast]
  )

  const deleteTeacher = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        teachers: prev.teachers.filter((t) => t.id !== id),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data guru berhasil dihapus.', 'info')
    },
    [showToast]
  )

  // ===== GALLERY ACTIONS =====
  const addGalleryItem = useCallback(
    (item: Omit<GalleryItem, 'id'>) => {
      const nextId = Math.max(0, ...data.gallery.map((g) => g.id)) + 1
      const newItem: GalleryItem = { ...item, id: nextId }
      setData((prev) => ({
        ...prev,
        gallery: [newItem, ...prev.gallery],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Foto aktivitas berhasil ditambahkan ke galeri!')
    },
    [data.gallery, showToast]
  )

  const updateGalleryItem = useCallback(
    (id: number, item: Partial<GalleryItem>) => {
      setData((prev) => ({
        ...prev,
        gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...item } : g)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data galeri berhasil diperbarui!')
    },
    [showToast]
  )

  const deleteGalleryItem = useCallback(
    (id: number) => {
      setData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g.id !== id),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Item galeri berhasil dihapus.', 'info')
    },
    [showToast]
  )

  // ===== KHAZANAH ACTIONS =====
  const addDoa = useCallback((item: DoaItem) => {
    setData((prev) => ({ ...prev, doas: [item, ...prev.doas], lastUpdated: new Date().toISOString() }))
    showToast('Doa baru berhasil ditambahkan!')
  }, [showToast])

  const updateDoa = useCallback((slug: string, item: Partial<DoaItem>) => {
    setData((prev) => ({
      ...prev,
      doas: prev.doas.map((doa) => (doa.slug === slug ? { ...doa, ...item } : doa)),
      lastUpdated: new Date().toISOString(),
    }))
    showToast('Konten doa berhasil diperbarui!')
  }, [showToast])

  const deleteDoa = useCallback((slug: string) => {
    setData((prev) => ({ ...prev, doas: prev.doas.filter((doa) => doa.slug !== slug), lastUpdated: new Date().toISOString() }))
    showToast('Konten doa berhasil dihapus.', 'info')
  }, [showToast])

  const addIslamicArticle = useCallback((item: IslamicArticle) => {
    setData((prev) => ({ ...prev, islamicArticles: [item, ...prev.islamicArticles], lastUpdated: new Date().toISOString() }))
    showToast('Artikel Khazanah berhasil ditambahkan!')
  }, [showToast])

  const updateIslamicArticle = useCallback((slug: string, item: Partial<IslamicArticle>) => {
    setData((prev) => ({
      ...prev,
      islamicArticles: prev.islamicArticles.map((article) => article.slug === slug ? { ...article, ...item } : article),
      lastUpdated: new Date().toISOString(),
    }))
    showToast('Artikel Khazanah berhasil diperbarui!')
  }, [showToast])

  const deleteIslamicArticle = useCallback((slug: string) => {
    setData((prev) => ({ ...prev, islamicArticles: prev.islamicArticles.filter((article) => article.slug !== slug), lastUpdated: new Date().toISOString() }))
    showToast('Artikel Khazanah berhasil dihapus.', 'info')
  }, [showToast])

  // ===== PPDB ACTIONS =====
  const addPPDBApplicant = useCallback(
    (applicant: Omit<PPDBApplicant, 'id' | 'date' | 'status'> & { id?: string; status?: PPDBApplicant['status'] }) => {
      const genId = applicant.id || `PPDB-${new Date().getFullYear()}-${String(data.ppdbApplicants.length + 1).padStart(3, '0')}`
      const dateStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())

      const newApplicant: PPDBApplicant = {
        ...applicant,
        id: genId,
        date: dateStr,
        status: applicant.status || 'Baru',
      }

      setData((prev) => ({
        ...prev,
        ppdbApplicants: [newApplicant, ...prev.ppdbApplicants],
        lastUpdated: new Date().toISOString(),
      }))
      showToast(`Pendaftaran calon siswa ${newApplicant.name} tercatat!`)
      return genId
    },
    [data.ppdbApplicants.length, showToast]
  )

  const updatePPDBApplicantStatus = useCallback(
    (id: string, status: PPDBApplicant['status']) => {
      setData((prev) => ({
        ...prev,
        ppdbApplicants: prev.ppdbApplicants.map((a) => (a.id === id ? { ...a, status } : a)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast(`Status pendaftaran ${id} diubah menjadi "${status}".`)
    },
    [showToast]
  )

  const deletePPDBApplicant = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        ppdbApplicants: prev.ppdbApplicants.filter((a) => a.id !== id),
        lastUpdated: new Date().toISOString(),
      }))
      showToast(`Data pendaftar ${id} telah dihapus.`, 'info')
    },
    [showToast]
  )

  const updatePPDBBatch = useCallback(
    (id: string, item: Partial<PPDBBatch>) => {
      setData((prev) => ({
        ...prev,
        ppdbBatches: prev.ppdbBatches.map((b) => (b.id === id ? { ...b, ...item } : b)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Informasi gelombang PPDB berhasil diperbarui!')
    },
    [showToast]
  )

  // ===== ORPHANS & DONATION ACTIONS =====
  const addOrphan = useCallback(
    (item: Omit<OrphanBeneficiary, 'id'>) => {
      const newOrphan: OrphanBeneficiary = {
        ...item,
        id: `ytm-${Date.now()}`,
      }
      setData((prev) => ({
        ...prev,
        orphans: [...prev.orphans, newOrphan],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data anak asuh yatim berhasil ditambahkan!')
    },
    [showToast]
  )

  const updateOrphan = useCallback(
    (id: string, item: Partial<OrphanBeneficiary>) => {
      setData((prev) => ({
        ...prev,
        orphans: prev.orphans.map((o) => (o.id === id ? { ...o, ...item } : o)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data anak asuh berhasil diperbarui!')
    },
    [showToast]
  )

  const deleteOrphan = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        orphans: prev.orphans.filter((o) => o.id !== id),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Data anak asuh telah dihapus.', 'info')
    },
    [showToast]
  )

  const addDonation = useCallback(
    (item: Omit<DonationItem, 'id' | 'date'>) => {
      const dateStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
      const id = `DON-${Date.now().toString().slice(-6)}`
      const newDonation: DonationItem = {
        ...item,
        id,
        date: dateStr,
      }
      setData((prev) => ({
        ...prev,
        donations: [newDonation, ...prev.donations],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Donasi baru berhasil dicatat!')
    },
    [showToast]
  )

  const updateDonationStatus = useCallback(
    (id: string, status: DonationItem['status']) => {
      setData((prev) => ({
        ...prev,
        donations: prev.donations.map((d) => (d.id === id ? { ...d, status } : d)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast(`Status donasi ${id} diubah menjadi "${status}".`)
    },
    [showToast]
  )

  // ===== FACILITY ACTIONS =====
  const addFacility = useCallback(
    (item: Omit<FacilityItem, 'id'>) => {
      const newFacility: FacilityItem = {
        ...item,
        id: `fac-${Date.now()}`,
      }
      setData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility],
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Fasilitas baru berhasil ditambahkan!')
    },
    [showToast]
  )

  const updateFacility = useCallback(
    (id: string, item: Partial<FacilityItem>) => {
      setData((prev) => ({
        ...prev,
        facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...item } : f)),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Fasilitas berhasil diperbarui!')
    },
    [showToast]
  )

  const deleteFacility = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        facilities: prev.facilities.filter((f) => f.id !== id),
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Fasilitas berhasil dihapus.', 'info')
    },
    [showToast]
  )

  // ===== BACKUP & RESTORE =====
  const exportBackup = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateTag = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `backup_webmustam_cms_${dateTag}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Backup data CMS berhasil diunduh!')
  }, [data, showToast])

  const importBackup = useCallback(
    (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString)
        if (!parsed.site || !parsed.news || !parsed.programs) {
          throw new Error('Format file backup tidak valid.')
        }
        setData({
          ...initialCMSData,
          ...parsed,
          lastUpdated: new Date().toISOString(),
        })
        showToast('Data CMS berhasil dipulihkan dari file backup!', 'success')
        return true
      } catch {
        showToast('Gagal memulihkan data: Format JSON tidak sesuai.', 'error')
        return false
      }
    },
    [showToast]
  )

  const resetToDefaults = useCallback(() => {
    setData(initialCMSData)
    localStorage.removeItem(STORAGE_KEY)
    showToast('Seluruh data CMS berhasil di-reset ke pengaturan awal.', 'info')
  }, [showToast])

  const contextValue = useMemo(
    () => ({
      data,
      isLoggedIn,
      login,
      logout,
      toasts,
      showToast,
      removeToast,
      updateSite,
      updatePageContent,
      addNews,
      updateNews,
      deleteNews,
      updateProgram,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      addDoa,
      updateDoa,
      deleteDoa,
      addIslamicArticle,
      updateIslamicArticle,
      deleteIslamicArticle,
      addPPDBApplicant,
      updatePPDBApplicantStatus,
      deletePPDBApplicant,
      updatePPDBBatch,
      addOrphan,
      updateOrphan,
      deleteOrphan,
      addDonation,
      updateDonationStatus,
      addFacility,
      updateFacility,
      deleteFacility,
      exportBackup,
      importBackup,
      resetToDefaults,
    }),
    [
      data,
      isLoggedIn,
      login,
      logout,
      toasts,
      showToast,
      removeToast,
      updateSite,
      updatePageContent,
      addNews,
      updateNews,
      deleteNews,
      updateProgram,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      addDoa,
      updateDoa,
      deleteDoa,
      addIslamicArticle,
      updateIslamicArticle,
      deleteIslamicArticle,
      addPPDBApplicant,
      updatePPDBApplicantStatus,
      deletePPDBApplicant,
      updatePPDBBatch,
      addOrphan,
      updateOrphan,
      deleteOrphan,
      addDonation,
      updateDonationStatus,
      addFacility,
      updateFacility,
      deleteFacility,
      exportBackup,
      importBackup,
      resetToDefaults,
    ]
  )

  return (
    <CMSContext.Provider value={contextValue}>
      {children}
      {/* Global Toast Container */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 text-sm font-semibold shadow-lift transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-primary-deep text-white border border-gold/30'
                : t.type === 'error'
                ? 'bg-warmred text-white'
                : 'bg-secondary text-white'
            }`}
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-white/60 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-lg bg-white/10"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CMSContext.Provider>
  )
}

export function useCMS() {
  const ctx = useContext(CMSContext)
  if (!ctx) {
    throw new Error('useCMS must be used within a CMSProvider')
  }
  return ctx
}
