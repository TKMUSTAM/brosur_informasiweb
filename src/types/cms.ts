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
  imageAlt?: string
  status?: 'DRAFT' | 'PUBLISHED'
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
  imageAlt?: string
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
  avatarAlt?: string
}

export type GalleryItem = {
  id: number
  title: string
  category: string
  scene: string
  palette: 'green' | 'blue' | 'gold' | 'red' | 'mixed'
  tall?: boolean
  image?: string
  imageAlt?: string
  description?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export type DoaItem = {
  slug: string
  title: string
  arabic: string
  latin: string
  meaning: string
  virtue?: string
  category: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export type IslamicArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  content: string[]
  image?: string
  imageAlt?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export type PPDBWave = {
  id: 'gelombang-1' | 'gelombang-2';
  name: string;
  period: string;
  quota?: string;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING';
  description?: string;
};

export type PageContent = {
  hero: {
    eyebrow: string
    title: string
    highlight: string
    titleSuffix: string
    description: string
    image: string
    imageAlt: string
    primaryLabel: string
    benefits: string[]
  }
  welcome: {
    eyebrow: string
    title: string
    quote: string
    body: string
    personName: string
    personRole: string
    image: string
    imageAlt: string
  }
  ppdb: {
    academicYear: string
    registrationOpen: boolean
    title: string
    description: string
    notice: string
    closedMessage?: string
    waves?: PPDBWave[]
    requirements: string[]
  }
  profile?: {
    title: string
    description: string
    aboutParagraph1: string
    aboutParagraph2: string
    image: string
    imageAlt: string
  }
  visionMission?: {
    visionText: string
    missionList: string[]
  }
  sejarah?: {
    milestones: Array<{
      year: string
      title: string
      desc: string
    }>
  }
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
  imageAlt?: string
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
  doas: DoaItem[]
  islamicArticles: IslamicArticle[]
  pageContent: PageContent
  ppdbApplicants: PPDBApplicant[]
  ppdbBatches: PPDBBatch[]
  orphans: OrphanBeneficiary[]
  donations: DonationItem[]
  facilities: FacilityItem[]
  pillars: PillarItem[]
  faqs: FAQItem[]
  lastUpdated: string
}
