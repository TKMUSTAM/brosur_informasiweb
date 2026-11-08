import React, { useEffect, useState, useMemo, useCallback } from 'react'
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
  PillarItem,
  FAQItem,
} from '../types/cms'
import { CMSContext, initialCMSData, STORAGE_KEY, type ToastNotification } from './cmsStore'

type PublicCmsSectionEntry = {
  sectionKey: string
  title?: string
  content: Record<string, unknown>
  updatedAt?: string
}

type PublicCmsPayload = {
  sections?: Record<string, Record<string, unknown>> | PublicCmsSectionEntry[]
  news?: Array<{
    id?: string
    title: string
    slug: string
    excerpt?: string
    content: string
    image?: string
    coverImagePath?: string
    date?: string
    publishedAt?: string
  }>
  programs?: Array<{
    id: string
    name?: string
    programName?: string
    description?: string
    image?: string
    imagePath?: string
    displayOrder?: number
  }>
  facilities?: Array<{
    id: string
    name?: string
    facilityName?: string
    description?: string
    image?: string
    imagePath?: string
    displayOrder?: number
  }>
  gallery?: Array<
    | {
        id: string
        category?: string
        src?: string
        caption?: string
      }
    | {
        id: string
        albumName: string
        description?: string
        coverImagePath?: string
        items?: Array<{
          id: string
          imagePath: string
          caption?: string
          displayOrder?: number
        }>
      }
  >
}

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CMSData>(initialCMSData)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Hydrate live CMS content from Neon Function (/cms/public)
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_PPDB_API_URL?.trim().replace(/\/$/, '')
    if (!apiUrl) return
    const controller = new AbortController()
    fetch(`${apiUrl}/cms/public`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: PublicCmsPayload | null) => {
        if (!result) return
        setData((prev) => {
          const sections: Record<string, Record<string, unknown>> = {}
          if (Array.isArray(result.sections)) {
            for (const entry of result.sections) {
              if (entry && typeof entry.sectionKey === 'string' && entry.content) {
                sections[entry.sectionKey] = entry.content
              }
            }
          } else if (result.sections && typeof result.sections === 'object') {
            Object.assign(sections, result.sections)
          }

          const siteSection = sections.site ?? {}
          const nextSite: SiteData = {
            ...prev.site,
            name: typeof siteSection.name === 'string' ? siteSection.name : prev.site.name,
            shortName: typeof siteSection.shortName === 'string' ? siteSection.shortName : prev.site.shortName,
            legalName: typeof siteSection.legalName === 'string' ? siteSection.legalName : prev.site.legalName,
            tagline: typeof siteSection.tagline === 'string' ? siteSection.tagline : prev.site.tagline,
            description: typeof siteSection.description === 'string' ? siteSection.description : prev.site.description,
            accreditation: typeof siteSection.accreditation === 'string' ? siteSection.accreditation : prev.site.accreditation,
            npsn: typeof siteSection.npsn === 'string' ? siteSection.npsn : prev.site.npsn,
            skKemenkumham: typeof siteSection.skKemenkumham === 'string' ? siteSection.skKemenkumham : prev.site.skKemenkumham,
            izinOperasional: typeof siteSection.izinOperasional === 'string' ? siteSection.izinOperasional : prev.site.izinOperasional,
            foundedYear: typeof siteSection.foundedYear === 'number' ? siteSection.foundedYear : prev.site.foundedYear,
            hours: typeof siteSection.hours === 'string' ? siteSection.hours : prev.site.hours,
            schoolHours: typeof siteSection.schoolHours === 'string' ? siteSection.schoolHours : prev.site.schoolHours,
            contact: {
              ...prev.site.contact,
              address: typeof siteSection.address === 'string' ? siteSection.address : prev.site.contact.address,
              addressShort: typeof siteSection.addressShort === 'string' ? siteSection.addressShort : prev.site.contact.addressShort,
              phone: typeof siteSection.phone === 'string' ? siteSection.phone : prev.site.contact.phone,
              whatsapp: typeof siteSection.whatsapp === 'string' ? siteSection.whatsapp : prev.site.contact.whatsapp,
              whatsappDisplay: typeof siteSection.whatsappDisplay === 'string' ? siteSection.whatsappDisplay : prev.site.contact.whatsappDisplay,
              email: typeof siteSection.email === 'string' ? siteSection.email : prev.site.contact.email,
              emailAdm: typeof siteSection.emailAdm === 'string' ? siteSection.emailAdm : prev.site.contact.emailAdm,
            },
          }

          const colors: Array<'green' | 'blue' | 'gold' | 'red'> = ['green', 'blue', 'gold', 'red']
          const nextNews: NewsItem[] =
            result.news && result.news.length > 0
              ? result.news.map((n, idx) => {
                  const rawDate = n.publishedAt || n.date
                  const dateISO = rawDate ? rawDate.slice(0, 10) : '2026-08-01'
                  const formattedDate = new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(dateISO))
                  const existing = prev.news.find((item) => item.slug === n.slug)
                  return {
                    slug: n.slug,
                    title: n.title,
                    category: existing?.category || 'Kegiatan Sekolah',
                    date: formattedDate,
                    dateISO,
                    excerpt: n.excerpt || existing?.excerpt || '',
                    content: n.content
                      .split(/\n\s*\n/)
                      .map((p) => p.trim())
                      .filter(Boolean),
                    color: existing?.color || colors[idx % colors.length],
                    featured: idx === 0,
                    image: n.coverImagePath || n.image || existing?.image || '/images/content/news-murojaah.jpg',
                    status: 'PUBLISHED',
                  }
                })
              : prev.news

          const nextPrograms: ProgramItem[] =
            result.programs && result.programs.length > 0
              ? result.programs.map((p, idx) => {
                  const existing = prev.programs[idx] || prev.programs[0]
                  const resolvedName = p.programName || p.name || existing.name
                  return {
                    ...existing,
                    name: resolvedName,
                    description: p.description || existing.description,
                    image: p.imagePath || p.image || existing.image,
                  }
                })
              : prev.programs

          const nextFacilities: FacilityItem[] =
            result.facilities && result.facilities.length > 0
              ? result.facilities.map((f, idx) => {
                  const existing = prev.facilities[idx]
                  return {
                    id: f.id,
                    icon: existing?.icon || 'mosque',
                    title: f.facilityName || f.name || existing?.title || 'Fasilitas Sekolah',
                    desc: f.description || existing?.desc || '',
                    tag: existing?.tag || 'Fasilitas Kampus',
                    image: f.imagePath || f.image || existing?.image,
                  }
                })
              : prev.facilities

          const flattenedGallery: GalleryItem[] = []
          if (result.gallery && result.gallery.length > 0) {
            const palettes: Array<'green' | 'blue' | 'gold' | 'red' | 'mixed'> = ['green', 'blue', 'gold', 'red', 'mixed']
            let seq = 1
            for (const entry of result.gallery) {
              if ('items' in entry && Array.isArray(entry.items)) {
                for (const item of entry.items) {
                  flattenedGallery.push({
                    id: seq,
                    title: item.caption || entry.albumName,
                    category: entry.albumName,
                    scene: 'quran',
                    palette: palettes[(seq - 1) % palettes.length],
                    tall: seq % 3 === 2,
                    image: item.imagePath,
                  })
                  seq += 1
                }
              } else if ('src' in entry && entry.src) {
                flattenedGallery.push({
                  id: seq,
                  title: entry.caption || entry.category || 'Dokumentasi Kegiatan',
                  category: entry.category || 'Kegiatan Sekolah',
                  scene: 'quran',
                  palette: palettes[(seq - 1) % palettes.length],
                  tall: seq % 3 === 2,
                  image: entry.src,
                })
                seq += 1
              }
            }
          }

          const pillarsContent = sections.pillars?.items
          const faqsContent = sections.faqs?.items
          const doasContent = sections.khazanah?.doas

          return {
            ...prev,
            site: nextSite,
            news: nextNews,
            programs: nextPrograms,
            facilities: nextFacilities,
            gallery: flattenedGallery.length > 0 ? flattenedGallery : prev.gallery,
            pillars: Array.isArray(pillarsContent) && pillarsContent.length > 0 ? (pillarsContent as PillarItem[]) : prev.pillars,
            faqs: Array.isArray(faqsContent) && faqsContent.length > 0 ? (faqsContent as FAQItem[]) : prev.faqs,
            doas: Array.isArray(doasContent) && doasContent.length > 0 ? (doasContent as DoaItem[]) : prev.doas,
            pageContent: {
              ...prev.pageContent,
              hero: sections.hero ? { ...prev.pageContent.hero, ...sections.hero } : prev.pageContent.hero,
              welcome: sections.welcome ? { ...prev.pageContent.welcome, ...sections.welcome } : prev.pageContent.welcome,
              ppdb: sections.ppdb ? { ...prev.pageContent.ppdb, ...sections.ppdb } : prev.pageContent.ppdb,
              profile: sections.profile
                ? { ...(prev.pageContent.profile ?? initialCMSData.pageContent.profile!), ...sections.profile }
                : prev.pageContent.profile,
              visionMission: sections.visionMission
                ? { ...(prev.pageContent.visionMission ?? initialCMSData.pageContent.visionMission!), ...sections.visionMission }
                : prev.pageContent.visionMission,
              sejarah: sections.sejarah
                ? { ...(prev.pageContent.sejarah ?? initialCMSData.pageContent.sejarah!), ...sections.sejarah }
                : prev.pageContent.sejarah,
            },
          }
        })
      })
      .catch(() => null)
    return () => controller.abort()
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const login = useCallback(() => {
    return false
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
  }, [])

  const updateSite = useCallback(
    (partial: Partial<SiteData>) => {
      setData((prev) => ({
        ...prev,
        site: { ...prev.site, ...partial },
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Identitas situs diperbarui.')
    },
    [showToast]
  )

  const updatePageContent = useCallback(
    <K extends keyof PageContent>(section: K, partial: Partial<PageContent[K]>) => {
      setData((prev) => ({
        ...prev,
        pageContent: {
          ...prev.pageContent,
          [section]: {
            ...prev.pageContent[section],
            ...partial,
          },
        },
        lastUpdated: new Date().toISOString(),
      }))
      showToast('Konten halaman diperbarui.')
    },
    [showToast]
  )

  const addNews = useCallback(
    (item: NewsItem) => {
      setData((prev) => ({
        ...prev,
        news: [item, ...prev.news],
        lastUpdated: new Date().toISOString(),
      }))
    },
    []
  )

  const updateNews = useCallback((slug: string, item: Partial<NewsItem>) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.map((n) => (n.slug === slug ? { ...n, ...item } : n)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteNews = useCallback((slug: string) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.filter((n) => n.slug !== slug),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateProgram = useCallback((slug: string, item: Partial<ProgramItem>) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.slug === slug ? { ...p, ...item } : p)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addTeacher = useCallback((item: Omit<TeacherItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      teachers: [...prev.teachers, { ...item, id: `guru-${Date.now()}` }],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateTeacher = useCallback((id: string, item: Partial<TeacherItem>) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => (t.id === id ? { ...t, ...item } : t)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteTeacher = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addGalleryItem = useCallback((item: Omit<GalleryItem, 'id'>) => {
    setData((prev) => {
      const maxId = prev.gallery.reduce((max, g) => Math.max(max, g.id), 0)
      return {
        ...prev,
        gallery: [{ ...item, id: maxId + 1 }, ...prev.gallery],
        lastUpdated: new Date().toISOString(),
      }
    })
  }, [])

  const updateGalleryItem = useCallback((id: number, item: Partial<GalleryItem>) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...item } : g)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteGalleryItem = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addDoa = useCallback((item: DoaItem) => {
    setData((prev) => ({ ...prev, doas: [item, ...prev.doas], lastUpdated: new Date().toISOString() }))
  }, [])

  const updateDoa = useCallback((slug: string, item: Partial<DoaItem>) => {
    setData((prev) => ({
      ...prev,
      doas: prev.doas.map((doa) => (doa.slug === slug ? { ...doa, ...item } : doa)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteDoa = useCallback((slug: string) => {
    setData((prev) => ({
      ...prev,
      doas: prev.doas.filter((doa) => doa.slug !== slug),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addIslamicArticle = useCallback((item: IslamicArticle) => {
    setData((prev) => ({
      ...prev,
      islamicArticles: [item, ...prev.islamicArticles],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateIslamicArticle = useCallback((slug: string, item: Partial<IslamicArticle>) => {
    setData((prev) => ({
      ...prev,
      islamicArticles: prev.islamicArticles.map((article) => (article.slug === slug ? { ...article, ...item } : article)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteIslamicArticle = useCallback((slug: string) => {
    setData((prev) => ({
      ...prev,
      islamicArticles: prev.islamicArticles.filter((article) => article.slug !== slug),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

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
      return genId
    },
    [data.ppdbApplicants.length]
  )

  const updatePPDBApplicantStatus = useCallback((id: string, status: PPDBApplicant['status']) => {
    setData((prev) => ({
      ...prev,
      ppdbApplicants: prev.ppdbApplicants.map((a) => (a.id === id ? { ...a, status } : a)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deletePPDBApplicant = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      ppdbApplicants: prev.ppdbApplicants.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updatePPDBBatch = useCallback((id: string, item: Partial<PPDBBatch>) => {
    setData((prev) => ({
      ...prev,
      ppdbBatches: prev.ppdbBatches.map((b) => (b.id === id ? { ...b, ...item } : b)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addOrphan = useCallback((item: Omit<OrphanBeneficiary, 'id'>) => {
    setData((prev) => ({
      ...prev,
      orphans: [...prev.orphans, { ...item, id: `ytm-${Date.now()}` }],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateOrphan = useCallback((id: string, item: Partial<OrphanBeneficiary>) => {
    setData((prev) => ({
      ...prev,
      orphans: prev.orphans.map((o) => (o.id === id ? { ...o, ...item } : o)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteOrphan = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      orphans: prev.orphans.filter((o) => o.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addDonation = useCallback((item: Omit<DonationItem, 'id' | 'date'>) => {
    const dateStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
    const id = `DON-${Date.now().toString().slice(-6)}`
    setData((prev) => ({
      ...prev,
      donations: [{ ...item, id, date: dateStr }, ...prev.donations],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateDonationStatus = useCallback((id: string, status: DonationItem['status']) => {
    setData((prev) => ({
      ...prev,
      donations: prev.donations.map((d) => (d.id === id ? { ...d, status } : d)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addFacility = useCallback((item: Omit<FacilityItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, { ...item, id: `fac-${Date.now()}` }],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const updateFacility = useCallback((id: string, item: Partial<FacilityItem>) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...item } : f)),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const deleteFacility = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

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
  }, [data])

  const importBackup = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as Partial<CMSData>
      if (!parsed.site || !parsed.news || !parsed.programs) return false
      setData({
        ...initialCMSData,
        ...parsed,
        lastUpdated: new Date().toISOString(),
      })
      return true
    } catch {
      return false
    }
  }, [])

  const resetToDefaults = useCallback(() => {
    setData(initialCMSData)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

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
      <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 text-sm font-semibold shadow-lift transition-all duration-300 ${
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
              Tutup
            </button>
          </div>
        ))}
      </div>
    </CMSContext.Provider>
  )
}
