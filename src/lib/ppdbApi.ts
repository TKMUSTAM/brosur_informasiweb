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
