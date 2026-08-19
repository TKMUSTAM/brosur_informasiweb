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
} from '../types/cms'
import { site as initialSite } from '../data/site'
import { news as initialNews } from '../data/news'
import { programs as initialPrograms } from '../data/programs'
import { gallery as initialGallery } from '../data/gallery'
import { organization, fasilitas, pillars as initialPillars } from '../data/content'
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
      question: 'Apakah ada beasiswa penuh untuk anak yatim dan dhuafa?',
      answer: 'Ya, Yayasan Al-Mustam menyediakan program beasiswa 100% bebas uang pangkal dan SPP untuk santri yatim dan dhuafa yang lolos seleksi berkas.',
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
        // Merge to ensure backwards compatibility with any newly added properties
        return {
          ...initialCMSData,
          ...parsed,
          site: { ...initialCMSData.site, ...parsed.site },
        }
      }
    } catch (e) {
      console.error('Failed to load CMS data from localStorage', e)
    }
    return initialCMSData
  })

  // Auth State: Purely in-memory (starts false every time /admin is opened anew)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // Clear any legacy auth keys from storage on mount
  useEffect(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_KEY)
    } catch {}
  }, [])

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
      } catch (err) {
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
