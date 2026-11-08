import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, CheckCircle2, FileWarning, SearchCheck, Upload } from 'lucide-react'
import {
  lookupPpdbStatus,
  reuploadPpdbDocument,
  type PpdbDocumentType,
  type PpdbLookupResult,
} from '../lib/ppdbApi'

const DOCUMENT_LABELS: Record<string, string> = {
  KARTU_KELUARGA: 'Kartu Keluarga (KK)',
  AKTA_KELAHIRAN: 'Akta Kelahiran Anak',
  KTP_WALI: 'KTP Orang Tua / Wali',
  PAS_FOTO: 'Pas Foto Calon Siswa',
  RIWAYAT_KESEHATAN: 'Riwayat Kesehatan',
}

const ALL_DOCUMENT_TYPES: PpdbDocumentType[] = [
  'KARTU_KELUARGA',
  'AKTA_KELAHIRAN',
  'KTP_WALI',
  'PAS_FOTO',
  'RIWAYAT_KESEHATAN',
]

function statusBadgeStyle(dbStatus?: string): string {
  switch (dbStatus) {
    case 'ACCEPTED':
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-900 border-emerald-300'
    case 'REJECTED':
      return 'bg-rose-100 text-rose-900 border-rose-300'
    case 'NEEDS_REVISION':
      return 'bg-amber-100 text-amber-900 border-amber-300'
    case 'WAITLISTED':
      return 'bg-sky-100 text-sky-900 border-sky-300'
    default:
      return 'bg-softgreen text-primary border-primary/20'
  }
}

function docStatusLabel(status: string): string {
  if (status === 'VERIFIED') return 'Terverifikasi'
  if (status === 'NEEDS_REVISION') return 'Perlu Perbaikan'
  if (status === 'REJECTED') return 'Ditolak'
  return 'Menunggu Pemeriksaan'
}

export default function PPDBStatus() {
  const [searchParams] = useSearchParams()
  const [number, setNumber] = useState(() => searchParams.get('no')?.trim() || '')
  const [phone, setPhone] = useState(() => searchParams.get('phone')?.trim() || '')
  const [result, setResult] = useState<PpdbLookupResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [uploadingType, setUploadingType] = useState<string>('')
  const [uploadNotice, setUploadNotice] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const initialNo = searchParams.get('no')?.trim()
    const initialPhone = searchParams.get('phone')?.trim()
    if (!initialNo || !initialPhone) return
    let active = true
    setLoading(true)
    lookupPpdbStatus(initialNo, initialPhone)
      .then((data) => {
        if (active) setResult(data)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Status belum dapat dimuat.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [searchParams])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setUploadNotice('')
    setUploadError('')
    setResult(null)
    try {
      setResult(await lookupPpdbStatus(number.trim(), phone.trim()))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Status belum dapat dimuat.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReupload(docType: PpdbDocumentType, file: File | null) {
    if (!file || !result) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran berkas maksimal 5 MB.')
      return
    }
    setUploadingType(docType)
    setUploadError('')
    setUploadNotice('')
    try {
      await reuploadPpdbDocument({
        applicationNumber: result.applicationNumber,
        phone: phone.trim(),
        documentType: docType,
        file,
      })
      const refreshed = await lookupPpdbStatus(result.applicationNumber, phone.trim())
      setResult(refreshed)
      setUploadNotice(`Berkas ${DOCUMENT_LABELS[docType] ?? docType} berhasil dikirim ulang.`)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Berkas belum dapat diunggah ulang.')
    } finally {
      setUploadingType('')
    }
  }

  const canReupload =
    result?.databaseStatus === 'NEEDS_REVISION' || result?.databaseStatus === 'SUBMITTED'

  return (
    <main className="min-h-[75vh] bg-cream/60 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/ppdb" className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline">
          ← Kembali ke informasi PPDB
        </Link>
        <section
          className="mt-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-lift sm:p-10"
          aria-labelledby="status-title"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary">
            <SearchCheck className="h-6 w-6" />
          </span>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary/70">
            PPDB TK Islam Al-Mustam
          </p>
          <h1 id="status-title" className="mt-2 font-heading text-3xl font-extrabold text-primary">
            Cek status pendaftaran
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Gunakan nomor registrasi dan nomor WhatsApp wali yang didaftarkan pada formulir.
          </p>

          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Nomor pendaftaran
              <input
                required
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="PPDB-MSTM-..."
                className="min-h-12 rounded-2xl border-2 border-primary/10 bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-primary"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Nomor WhatsApp wali
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="08xxxxxxxxxx"
                className="min-h-12 rounded-2xl border-2 border-primary/10 bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-primary"
              />
            </label>
            <button
              disabled={loading}
              className="min-h-12 rounded-2xl bg-primary px-5 text-sm font-bold text-white shadow-soft disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Memeriksa status...' : 'Periksa status'}
            </button>
          </form>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-2xl border border-warmred/30 bg-softred/40 p-4 text-sm font-semibold text-warmred"
            >
              {error}
            </p>
          )}

          {result && (
            <div className="mt-6 space-y-4 rounded-2xl border border-primary/10 bg-cream p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-primary/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">
                    {result.applicationNumber}
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-extrabold text-primary">
                    {result.candidateName}
                  </h2>
                  {result.program && (
                    <p className="mt-0.5 text-xs font-semibold text-ink-soft">
                      Jenjang: {result.program} {result.jalur ? `• Jalur ${result.jalur}` : ''}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex rounded-full border px-3.5 py-1.5 text-xs font-extrabold ${statusBadgeStyle(
                    result.databaseStatus,
                  )}`}
                >
                  {result.status}
                </span>
              </div>

              {(result.className || result.nitkm || result.nisn) && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs sm:text-sm text-emerald-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>Penempatan Kelas &amp; Nomor Induk</span>
                  </p>
                  <div className="mt-2 grid gap-1 sm:grid-cols-3">
                    {result.className && (
                      <p>
                        Rombel: <strong>{result.className}</strong>
                      </p>
                    )}
                    {result.nitkm && (
                      <p>
                        No. Induk TK: <strong>{result.nitkm}</strong>
                      </p>
                    )}
                    {result.nisn && (
                      <p>
                        NISN: <strong>{result.nisn}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {result.interviewScheduledAt && (
                <div className="flex gap-3 rounded-xl border border-primary/10 bg-white p-4 text-sm text-ink-soft">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <strong className="block text-ink">Jadwal wawancara &amp; observasi</strong>
                    <span>
                      {new Intl.DateTimeFormat('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      }).format(new Date(result.interviewScheduledAt))}
                      {result.interviewLocation ? ` • Lokasi: ${result.interviewLocation}` : ''}
                    </span>
                  </div>
                </div>
              )}

              {result.missingDocuments?.length ? (
                <div className="flex gap-3 rounded-xl border border-warmred/20 bg-softred/30 p-4 text-sm text-ink-soft">
                  <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-warmred" />
                  <div>
                    <strong className="block text-ink">Berkas yang perlu dilengkapi atau diperbaiki</strong>
                    <ul className="mt-1 list-disc pl-5 text-xs sm:text-sm">
                      {result.missingDocuments.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {result.verificationNote && (
                      <p className="mt-2 text-xs font-semibold text-warmred">
                        Catatan verifikator: {result.verificationNote}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {result.decisionNote && (
                <p className="rounded-xl border border-primary/10 bg-white p-3.5 text-xs sm:text-sm leading-relaxed text-ink-soft">
                  <strong className="text-ink">Keterangan: </strong>
                  {result.decisionNote}
                </p>
              )}

              {/* Daftar Berkas & Fitur Unggah Ulang saat NEEDS_REVISION / SUBMITTED */}
              <div className="rounded-xl border border-primary/10 bg-white p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Status Berkas Dokumen
                </h3>
                {uploadNotice && (
                  <p role="status" className="mt-2 rounded-lg bg-softgreen px-3 py-2 text-xs font-bold text-primary">
                    {uploadNotice}
                  </p>
                )}
                {uploadError && (
                  <p role="alert" className="mt-2 rounded-lg bg-softred/50 px-3 py-2 text-xs font-bold text-warmred">
                    {uploadError}
                  </p>
                )}

                <div className="mt-3 divide-y divide-primary/5">
                  {ALL_DOCUMENT_TYPES.map((docType) => {
                    const existing = result.documents?.find((d) => d.type === docType)
                    const isUploading = uploadingType === docType
                    return (
                      <div
                        key={docType}
                        className="flex flex-col justify-between gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-xs font-bold text-ink">
                            {DOCUMENT_LABELS[docType] ?? docType}
                          </p>
                          {existing ? (
                            <p className="text-[11px] text-ink-mute">
                              {existing.fileName} •{' '}
                              <span
                                className={
                                  existing.status === 'VERIFIED'
                                    ? 'font-bold text-emerald-700'
                                    : existing.status === 'NEEDS_REVISION' || existing.status === 'REJECTED'
                                      ? 'font-bold text-warmred'
                                      : 'font-semibold text-primary'
                                }
                              >
                                {docStatusLabel(existing.status)}
                              </span>
                              {existing.note ? ` (${existing.note})` : ''}
                            </p>
                          ) : (
                            <p className="text-[11px] text-ink-mute">Belum diunggah</p>
                          )}
                        </div>

                        {canReupload && existing?.status !== 'VERIFIED' && (
                          <label className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-primary/20 bg-softgreen px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">
                            <Upload className="h-3.5 w-3.5" />
                            <span>
                              {isUploading
                                ? 'Mengunggah...'
                                : existing
                                  ? 'Unggah Ulang'
                                  : 'Unggah Berkas'}
                            </span>
                            <input
                              type="file"
                              disabled={Boolean(uploadingType)}
                              accept="application/pdf,image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                e.target.value = ''
                                void handleReupload(docType, file)
                              }}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
