import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, FileWarning, SearchCheck } from 'lucide-react'
import { lookupPpdbStatus } from '../lib/ppdbApi'

export default function PPDBStatus() {
  const [number, setNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupPpdbStatus>> | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await lookupPpdbStatus(number, phone))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Status belum dapat dimuat.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[75vh] bg-cream/60 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/ppdb" className="text-sm font-bold text-primary hover:underline">← Kembali ke informasi PPDB</Link>
        <section className="mt-5 rounded-3xl border border-primary/10 bg-white p-6 shadow-lift sm:p-10" aria-labelledby="status-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary"><SearchCheck className="h-6 w-6" /></span>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary/70">PPDB TK Islam Al-Mustam</p>
          <h1 id="status-title" className="mt-2 font-heading text-3xl font-extrabold text-primary">Cek status pendaftaran</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">Gunakan nomor registrasi dan nomor WhatsApp yang sama dengan formulir pendaftaran.</p>

          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Nomor pendaftaran
              <input required value={number} onChange={(event) => setNumber(event.target.value)} placeholder="PPDB-MSTM-..." className="min-h-12 rounded-2xl border-2 border-primary/10 bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-primary" />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Nomor WhatsApp wali
              <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" className="min-h-12 rounded-2xl border-2 border-primary/10 bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-primary" />
            </label>
            <button disabled={loading} className="min-h-12 rounded-2xl bg-primary px-5 text-sm font-bold text-white shadow-soft disabled:cursor-wait disabled:opacity-60">{loading ? 'Memeriksa status…' : 'Periksa status'}</button>
          </form>

          {error && <p role="alert" className="mt-5 rounded-2xl border border-warmred/30 bg-softred/40 p-4 text-sm font-semibold text-warmred">{error}</p>}

          {result && (
            <div className="mt-6 rounded-2xl border border-primary/10 bg-cream p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Calon siswa</p>
              <h2 className="mt-1 font-heading text-xl font-extrabold text-primary">{result.candidateName}</h2>
              <p className="mt-3 inline-flex rounded-full bg-softgreen px-3 py-1.5 text-sm font-extrabold text-primary">{result.status}</p>
              {result.className && <p className="mt-4 text-sm font-semibold text-ink">Kelas: {result.className}</p>}
              {result.interviewScheduledAt && (
                <div className="mt-4 flex gap-3 rounded-xl border border-primary/10 bg-white p-4 text-sm text-ink-soft">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p><strong className="block text-ink">Jadwal wawancara / observasi</strong>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(result.interviewScheduledAt))}{result.interviewLocation ? ` · ${result.interviewLocation}` : ''}</p>
                </div>
              )}
              {result.missingDocuments?.length ? (
                <div className="mt-4 flex gap-3 rounded-xl border border-warmred/20 bg-softred/30 p-4 text-sm text-ink-soft">
                  <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-warmred" />
                  <div><strong className="block text-ink">Berkas yang perlu diperbaiki</strong><ul className="mt-1 list-disc pl-5">{result.missingDocuments.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
              ) : null}
              {result.decisionNote && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{result.decisionNote}</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
