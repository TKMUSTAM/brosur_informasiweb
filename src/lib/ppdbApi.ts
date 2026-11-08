export type PpdbRegistrationPayload = {
  name: string
  nik: string
  birthPlace: string
  birthDate: string
  gender: string
  address: string
  previousSchool: string
  program: string
  track: 'Reguler' | 'Beasiswa Yatim & Dhuafa'
  parentFather: string
  parentMother: string
  fatherNik: string
  motherNik: string
  familyCardNumber: string
  medicalNotes: string
  whatsapp: string
  email: string
  guardianAddress: string
}

export type PpdbDocumentType =
  | 'KARTU_KELUARGA'
  | 'AKTA_KELAHIRAN'
  | 'KTP_WALI'
  | 'RIWAYAT_KESEHATAN'
  | 'PAS_FOTO'

export type PpdbDocumentStatus = {
  id: string
  type: PpdbDocumentType | string
  fileName: string
  status: 'PENDING' | 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED' | string
  note?: string | null
}

export type PpdbLookupResult = {
  id?: string
  applicationNumber: string
  candidateName: string
  program?: string | null
  jalur?: string | null
  nisn?: string | null
  nitkm?: string | null
  status: string
  databaseStatus?: string
  verificationNote?: string | null
  missingDocuments?: string[]
  decisionNote?: string | null
  className?: string | null
  interviewScheduledAt?: string | null
  interviewLocation?: string | null
  documents?: PpdbDocumentStatus[]
  updatedAt?: string
}

export type PpdbMeta = {
  periods: Array<{
    id: string
    name: string
    registrationStart: string
    registrationEnd: string
    status: string
    academicYear: string
  }>
  classes: Array<{
    id: string
    className: string
    classLevel: string | null
    capacity: number | null
    levelCode: string | null
    levelName: string | null
    enrolledCount: number
  }>
  documentTypes: Array<{
    code: string
    name: string
    isRequired: boolean
    description: string | null
  }>
}

type PpdbRegistrationResult = {
  id?: string
  applicationNumber: string
  submittedAt?: string
  duplicate?: boolean
}

function getApiUrl() {
  const baseUrl = import.meta.env.VITE_PPDB_API_URL?.trim().replace(/\/$/, '')
  if (!baseUrl) {
    throw new Error('Layanan pendaftaran belum dikonfigurasi. Silakan hubungi admin PPDB.')
  }
  return baseUrl
}

export async function fetchPpdbMeta(): Promise<PpdbMeta | null> {
  const baseUrl = import.meta.env.VITE_PPDB_API_URL?.trim().replace(/\/$/, '')
  if (!baseUrl) return null
  const response = await fetch(`${baseUrl}/ppdb/meta`, { cache: 'no-store' })
  if (!response.ok) return null
  return (await response.json()) as PpdbMeta
}

export async function submitPpdbRegistration(
  payload: PpdbRegistrationPayload,
): Promise<PpdbRegistrationResult> {
  const response = await fetch(`${getApiUrl()}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const result = (await response.json().catch(() => null)) as
    | (Partial<PpdbRegistrationResult> & { error?: string })
    | null

  if (!response.ok || !result?.applicationNumber) {
    throw new Error(result?.error || 'Pendaftaran belum dapat dikirim. Silakan coba lagi.')
  }

  return result as PpdbRegistrationResult
}

export async function uploadPpdbDocument(params: {
  applicationId: string
  applicationNumber: string
  phone: string
  documentType: PpdbDocumentType
  file: File
}) {
  const form = new FormData()
  form.set('applicationNumber', params.applicationNumber)
  form.set('phone', params.phone)
  form.set('documentType', params.documentType)
  form.set('file', params.file)

  const response = await fetch(
    `${getApiUrl()}/registrations/${encodeURIComponent(params.applicationId)}/documents`,
    {
      method: 'POST',
      body: form,
    },
  )
  const result = (await response.json().catch(() => null)) as { error?: string } | null
  if (!response.ok) throw new Error(result?.error || 'Berkas belum dapat diunggah.')
}

export async function reuploadPpdbDocument(params: {
  applicationNumber: string
  phone: string
  documentType: PpdbDocumentType | string
  file: File
}): Promise<PpdbDocumentStatus> {
  const form = new FormData()
  form.set('phone', params.phone)
  form.set('documentType', params.documentType)
  form.set('file', params.file)

  const response = await fetch(
    `${getApiUrl()}/status/${encodeURIComponent(params.applicationNumber)}/documents`,
    {
      method: 'POST',
      body: form,
    },
  )
  const result = (await response.json().catch(() => null)) as {
    document?: PpdbDocumentStatus
    error?: string
  } | null
  if (!response.ok || !result?.document) {
    throw new Error(result?.error || 'Berkas perbaikan belum dapat diunggah.')
  }
  return result.document
}

export async function lookupPpdbStatus(
  applicationNumber: string,
  phone: string,
): Promise<PpdbLookupResult> {
  const response = await fetch(
    `${getApiUrl()}/status/${encodeURIComponent(applicationNumber)}?phone=${encodeURIComponent(phone)}`,
    { cache: 'no-store' },
  )
  const result = (await response.json().catch(() => null)) as
    | (Partial<PpdbLookupResult> & { error?: string })
    | null
  if (!response.ok || !result?.status) {
    throw new Error(result?.error || 'Status pendaftaran belum dapat dimuat.')
  }
  return result as PpdbLookupResult
}
