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
  whatsapp: string
  email: string
  guardianAddress: string
  familyCardNumber: string
  fatherNik: string
  fatherOccupation: string
  fatherEducation: string
  motherNik: string
  motherOccupation: string
  motherEducation: string
  childOrder: string
  siblingCount: string
  bloodType: string
  medicalNotes: string
}

export type PpdbDocumentType = 'KARTU_KELUARGA' | 'AKTA_KELAHIRAN' | 'KTP_ORANG_TUA' | 'PAS_FOTO'

type PpdbRegistrationResult = {
  id?: string
  applicationNumber: string
  submittedAt?: string
  duplicate?: boolean
}

export async function submitPpdbDocument(
  applicationNumber: string,
  phone: string,
  documentType: PpdbDocumentType,
  file: File,
) {
  const body = new FormData()
  body.set('phone', phone)
  body.set('documentType', documentType)
  body.set('file', file)
  const response = await fetch(`${getApiUrl()}/registrations/${encodeURIComponent(applicationNumber)}/documents`, {
    method: 'POST',
    body,
  })
  const result = await response.json().catch(() => null) as { document?: unknown; error?: string } | null
  if (!response.ok || !result?.document) {
    throw new Error(result?.error || 'Berkas belum dapat diunggah. Silakan coba lagi.')
  }
  return result.document
}

function getApiUrl() {
  const baseUrl = import.meta.env.VITE_PPDB_API_URL?.trim().replace(/\/$/, '')
  if (!baseUrl) {
    throw new Error('Layanan pendaftaran belum dikonfigurasi. Silakan hubungi admin PPDB.')
  }
  return baseUrl
}

export async function submitPpdbRegistration(
  payload: PpdbRegistrationPayload,
): Promise<PpdbRegistrationResult> {
  const response = await fetch(`${getApiUrl()}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null) as
    | (Partial<PpdbRegistrationResult> & { error?: string })
    | null

  if (!response.ok || !result?.applicationNumber) {
    throw new Error(result?.error || 'Pendaftaran belum dapat dikirim. Silakan coba lagi.')
  }

  return result as PpdbRegistrationResult
}

export async function lookupPpdbStatus(applicationNumber: string, phone: string) {
  const response = await fetch(`${getApiUrl()}/status/${encodeURIComponent(applicationNumber)}?phone=${encodeURIComponent(phone)}`)
  const result = await response.json().catch(() => null) as { error?: string; status?: string; candidateName?: string; missingDocuments?: string[]; decisionNote?: string; className?: string | null } | null
  if (!response.ok || !result?.status) throw new Error(result?.error || 'Status pendaftaran belum dapat dimuat.')
  return result
}
