import { useState } from 'react'
import { Download, FileText, ShieldCheck, Eye } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { Button } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { donationReports } from '../data/donations'
import { formatRupiah, formatNumber } from '../lib/format'

export default function Transparansi() {
  useSEO({
    title: 'Transparansi Dana',
    description: 'Laporan keuangan dan penyaluran donasi Yayasan Mustam yang transparan dan dapat diakses publik.',
    path: '/yatim/transparansi',
  })

  const [year, setYear] = useState('2026')
  const report = donationReports.find((r) => r.year === year) ?? donationReports[0]
  const progress = Math.min(100, Math.round((report.collected / report.target) * 100))

  return (
    <>
      <PageHeader
        eyebrow="Transparansi Dana"
        title="Laporan Keuangan Terbuka untuk Publik"
        description="Kami meyakini kepercayaan dibangun di atas keterbukaan. Berikut ringkasan laporan keuangan yayasan."
        crumbs={[{ label: 'Program Yatim', href: '/yatim' }, { label: 'Transparansi Dana' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          {/* filter */}
          <Reveal className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-full border border-primary/10 bg-white p-1.5 shadow-soft" role="group" aria-label="Pilih tahun laporan">
              {donationReports.map((r) => (
                <button
                  key={r.year}
                  type="button"
                  onClick={() => setYear(r.year)}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                    year === r.year ? 'bg-primary text-white shadow-soft' : 'text-ink-soft hover:bg-softgreen'
                  }`}
                  aria-pressed={year === r.year}
                >
                  {r.year}
                </button>
              ))}
            </div>
            <Button variant="soft" size="sm">
              <Download className="h-4 w-4" /> Unduh Laporan {year}
            </Button>
          </Reveal>

          {/* ringkasan */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Donasi Terkumpul', value: formatRupiah(report.collected) },
              { label: 'Dana Tersalurkan', value: formatRupiah(report.distributed) },
              { label: 'Penerima Manfaat', value: `${formatNumber(report.beneficiaries)} anak` },
              { label: 'Capaian Target', value: `${progress}%` },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="rounded-card bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">{s.label}</p>
                  <p className="mt-1.5 font-heading text-xl font-extrabold text-primary">{s.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* progress */}
          <Reveal className="mt-6 rounded-card bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-extrabold text-primary">Capaian Target {year}</h2>
              <span className="text-sm font-extrabold text-primary">{progress}%</span>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-cream" role="progressbar" aria-label={`Capaian target donasi ${year}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-mint transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              <strong className="text-primary">{formatRupiah(report.collected)}</strong> dari target{' '}
              <strong className="text-primary">{formatRupiah(report.target)}</strong>
            </p>
          </Reveal>

          {/* distribusi detail */}
          <Reveal className="mt-6 rounded-card bg-white p-7 shadow-soft">
            <h2 className="font-heading text-lg font-extrabold text-primary">Rincian Distribusi Dana {year}</h2>
            <div className="mt-6 space-y-5">
              {report.distribution.map((d) => {
                const amount = Math.round((d.value / 100) * report.distributed)
                return (
                  <div key={d.label}>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-ink">{d.label}</span>
                      <span className="font-extrabold text-primary">
                        {formatRupiah(amount)} <span className="font-semibold text-ink-mute">({d.value}%)</span>
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-cream">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          {/* tabel penyaluran bulanan */}
          <Reveal className="mt-6 overflow-hidden rounded-card bg-white shadow-soft">
            <h2 className="border-b border-primary/5 bg-cream px-7 py-5 font-heading text-lg font-extrabold text-primary">
              Penyaluran per Bulan {year}
            </h2>
            <div className="thin-scroll overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-primary/5 text-xs uppercase tracking-wider text-ink-mute">
                    <th className="px-7 py-4 font-bold">Bulan</th>
                    <th className="px-4 py-4 font-bold">Donasi Masuk</th>
                    <th className="px-4 py-4 font-bold">Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {report.months.map((m) => (
                    <tr key={m.month} className="border-b border-primary/5 transition-colors last:border-0 hover:bg-cream/60">
                      <td className="px-7 py-3.5 font-bold text-primary">{m.month}</td>
                      <td className="px-4 py-3.5 font-semibold text-ink">{formatRupiah(m.value)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-cream">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${(m.value / 61_000_000) * 100}%` }} />
                          </div>
                          <span className="text-xs text-ink-mute">{Math.round((m.value / 61_000_000) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* pernyataan */}
          <Reveal className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-card bg-softgreen p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-primary">Laporan diperiksa berkala oleh pengurus dan terbuka untuk ditinjau publik.</p>
            </div>
            <div className="flex items-start gap-3 rounded-card bg-softblue p-5">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <p className="text-sm leading-relaxed text-secondary-dark">Dokumen pendukung tersedia di sekretariat yayasan.</p>
            </div>
            <div className="flex items-start gap-3 rounded-card bg-softyellow p-5">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
              <p className="text-sm leading-relaxed text-gold-dark">Data pada halaman ini bersifat placeholder dan siap diintegrasikan dengan backend.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
