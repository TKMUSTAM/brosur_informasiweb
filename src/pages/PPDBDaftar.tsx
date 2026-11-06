import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCMS } from '../context/CMSContext'
import { site } from '../data/site'
import { RiAlertLine, RiWhatsappLine, RiArrowLeftLine, RiInformationLine } from 'react-icons/ri'

export default function PPDBDaftar() {
  const { data } = useCMS()
  const ppdb = data.pageContent.ppdb
  const waves = ppdb.waves || [
    {
      id: 'gelombang-1',
      name: 'Gelombang 1 (Early Bird & Beasiswa Yatim)',
      period: '1 Januari – 30 April 2026',
      quota: 'Sisa 8 Kuota',
      status: 'CLOSED',
      description: 'Diskon 10% Uang Pangkal & Beasiswa Khusus Yatim',
    },
    {
      id: 'gelombang-2',
      name: 'Gelombang 2 (Reguler)',
      period: '1 Mei – 10 Juli 2026',
      quota: '30 Kuota Tersedia',
      status: 'UPCOMING',
      description: 'Pendaftaran reguler semester ganjil tahun ajaran baru',
    },
  ]

  const hasOpenWave = waves.some((w) => w.status === 'OPEN')
  const isAvailable = Boolean(ppdb.registrationOpen && hasOpenWave)

  useEffect(() => {
    if (isAvailable) {
      window.location.replace('http://localhost:5175/daftar')
    }
  }, [isAvailable])

  if (isAvailable) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-cream">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent mb-4" />
        <h2 className="font-heading text-xl font-bold text-primary">Mengalihkan ke Portal PPDB Mandiri...</h2>
        <p className="text-xs text-ink-mute mt-2 max-w-md">
          Pendaftaran online sedang dibuka. Jika Anda tidak dialihkan secara otomatis, silakan{' '}
          <a href="http://localhost:5175/daftar" className="text-gold-dark font-extrabold underline hover:text-primary">
            klik di sini untuk membuka formulir pendaftaran
          </a>.
        </p>
      </div>
    )
  }

  // JIKA PENDAFTARAN DITUTUP / BELUM DIBUKA
  return (
    <div className="min-h-[75vh] bg-cream/60 py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Banner Permohonan Maaf */}
        <div className="rounded-3xl border border-amber-200 bg-white p-8 sm:p-10 shadow-soft text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <RiAlertLine className="h-8 w-8" />
          </div>

          <div className="inline-block rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1 text-xs font-bold text-rose-700">
            Akses Formulir Pendaftaran Dikunci
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">
            Mohon Maaf, Pendaftaran PPDB Saat Ini Belum Dibuka
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-ink-soft max-w-xl mx-auto">
            {ppdb.closedMessage ||
              'Mohon maaf, pendaftaran peserta didik baru saat ini belum dibuka atau kuota pada gelombang aktif telah terpenuhi. Silakan periksa status 2 Gelombang di bawah atau hubungi panitia melalui WhatsApp.'}
          </p>

          {/* Action buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
                'Assalamualaikum Admin, saya ingin mendaftar PPDB TK Mustam tapi status saat ini ditutup. Apakah bisa masuk waiting list / info jadwal gelombang berikutnya?'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-primary-light transition-all"
            >
              <RiWhatsappLine className="h-4 w-4 text-gold" />
              <span>Daftar Tunggu via WhatsApp</span>
            </a>

            <Link
              to="/ppdb"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-cream/70 px-6 py-3 text-xs sm:text-sm font-bold text-primary hover:bg-cream transition-all"
            >
              <RiInformationLine className="h-4 w-4 text-gold-dark" />
              <span>Lihat Syarat &amp; Biaya</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-ink-soft hover:bg-slate-50 transition-all"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              <span>Ke Beranda</span>
            </Link>
          </div>
        </div>

        {/* Status 2 Gelombang Pendaftaran */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-lg font-bold text-primary">Jadwal &amp; Status 2 Gelombang Pendaftaran</h2>
            <p className="text-xs text-ink-mute">Informasi pembukaan gelombang tahun ajaran {ppdb.academicYear}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {waves.map((wave, idx) => {
              const isWave1 = idx === 0
              return (
                <div key={wave.id} className="rounded-2xl border border-primary/10 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-black uppercase tracking-wider text-primary">
                      {isWave1 ? 'Gelombang 1' : 'Gelombang 2'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        wave.status === 'OPEN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : wave.status === 'CLOSED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {wave.status === 'OPEN' ? '🟢 DIBUKA' : wave.status === 'CLOSED' ? '🔴 DITUTUP' : '🟡 BELUM DIBUKA'}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-primary">{wave.name}</h3>
                  <p className="text-xs text-ink-mute">
                    <strong>Jadwal:</strong> {wave.period}
                  </p>
                  {wave.quota && (
                    <p className="text-xs text-ink-soft">
                      <strong>Kuota:</strong> {wave.quota}
                    </p>
                  )}
                  {wave.description && (
                    <p className="text-xs text-ink-soft border-t border-primary/5 pt-2 italic">
                      "{wave.description}"
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
