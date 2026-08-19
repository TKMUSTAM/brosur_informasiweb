// ============================================================
// CMS TYPES & DATA MODELS — WEBMUSTAM
// ============================================================

export type SiteContact = {
  address: string
  addressShort: string
  phone: string
  whatsapp: string
  whatsappDisplay: string
  email: string
  emailAdm: string
}

export type SiteSocial = {
  instagram: string
  facebook: string
  youtube: string
}

export type SiteBank = {
  bankName: string
  accountNumber: string
  accountHolder: string
}

export type SiteData = {
  name: string
  shortName: string
  legalName: string
  tagline: string
  description: string
  accreditation: string
  npsn: string
  skKemenkumham: string
  izinOperasional: string
  foundedYear: number
  contact: SiteContact
  hours: string
  schoolHours: string
  social: SiteSocial
  bank: SiteBank
  mapsEmbed: string
  mapsLink: string
  adminUsername?: string
  adminPassword?: string
  adminPin?: string
}

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
  image?: string
}

export type ProgramItem = {
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
  monthlyFee?: number
  entryFee?: number
}

export type TeacherItem = {
  id: string
  name: string
  role: string
  note: string
  education?: string
  avatar?: string
}

export type GalleryItem = {
  id: number
  title: string
  category: string
  scene: string
  palette: 'green' | 'blue' | 'gold' | 'red' | 'mixed'
  tall?: boolean
  image?: string
}

export type PPDBApplicant = {
  id: string
  name: string
  nik?: string
  birthPlace?: string
  birthDate?: string
  gender?: string
  address?: string
  previousSchool?: string
  program: string
  track: 'Reguler' | 'Beasiswa Yatim & Dhuafa'
  parentFather?: string
  parentMother?: string
  whatsapp: string
  email?: string
  date: string
  status: 'Baru' | 'Verifikasi' | 'Wawancara' | 'Diterima' | 'Ditolak'
  notes?: string
}

export type PPDBBatch = {
  id: string
  name: string
  period: string
  startDate: string
  endDate: string
  quota: number
  filled: number
  isActive: boolean
}

export type OrphanBeneficiary = {
  id: string
  name: string
  age: number
  grade: string
  gender: 'Laki-laki' | 'Perempuan'
  monthlyNeed: number
  status: 'Aktif Terbantu' | 'Menunggu Wali Asuh' | 'Lulus'
  guardian?: string
}

export type DonationItem = {
  id: string
  donor: string
  program: string
  amount: number
  date: string
  status: 'Terkumpul' | 'Tersalur' | 'Pending'
  notes?: string
}

export type FacilityItem = {
  id: string
  icon: string
  title: string
  desc: string
  tag: string
  image?: string
}

export type PillarItem = {
  number: string
  title: string
  icon: string
  color: 'green' | 'blue' | 'gold' | 'red'
  description: string
}

export type FAQItem = {
  id: string
  category: string
  question: string
  answer: string
}

export type CMSData = {
  site: SiteData
  news: NewsItem[]
  programs: ProgramItem[]
  teachers: TeacherItem[]
  gallery: GalleryItem[]
  ppdbApplicants: PPDBApplicant[]
  ppdbBatches: PPDBBatch[]
  orphans: OrphanBeneficiary[]
  donations: DonationItem[]
  facilities: FacilityItem[]
  pillars: PillarItem[]
  faqs: FAQItem[]
  lastUpdated: string
}
