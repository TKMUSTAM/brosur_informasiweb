import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, TrendingUp, Wallet, Users, HandCoins } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { donationReports } from '../data/donations'
import { formatRupiah, formatRupiahShort } from '../lib/format'

export default function Transparency() {
  const [year, setYear] = useState('2026')
  const report = donationReports.find((r) => r.year === year) ?? donationReports[0]
  const progress = Math.min(100, Math.round((report.collected / report.target) * 100))
  const maxMonth = Math.max(...report.months.map((m) => m.value))

  const summary = [
    { label: 'Donasi Terkumpul', value: formatRupiah(report.collected), icon: Wallet, color: 'text-primary bg-softgreen' },
    { label: 'Target', value: formatRupiah(report.target), icon: TrendingUp, color: 'text-secondary bg-softblue' },
    { label: 'Dana Tersalurkan', value: formatRupiah(report.distributed), icon: HandCoins, color: 'text-gold-dark bg-softyellow' },
    { label: 'Penerima Manfaat', value: `${report.beneficiaries} anak`, icon: Users, color: 'text-warmred bg-softred' },
  ]

  return (
    <section className="bg-cream px-4 py-20 sm:px-6 sm:py-24" aria-label="Transparansi donasi">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Transparansi Donasi"
          title="Donasi Anda, Amanah Kami"
          subtitle="Setiap rupiah tercatat, tersalurkan, dan dapat Anda pantau melalui laporan berkala."
        />

        {/* filter tahun */}
        <Reveal className="mt-10 flex justify-center">
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
        </Reveal>

        {/* summary cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="rounded-card bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">{s.label}</p>
                <p className="mt-1 font-heading text-xl font-extrabold text-primary sm:text-2xl">{s.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* progress + charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* progress */}
          <Reveal className="rounded-card bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-extrabold text-primary">Capaian {report.year}</h3>
              <span className="text-sm font-extrabold text-primary">{progress}%</span>
            </div>
            <div className="mt-4 h-3.5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Capaian donasi ${year}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-mint transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>

            {/* bar chart bulanan */}
            <h4 className="mt-7 text-sm font-bold text-ink-soft">Donasi per Bulan</h4>
            <div className="mt-4 flex h-36 items-end gap-1.5" aria-hidden="true">
              {report.months.map((m) => (
                <div key={m.month} className="group relative flex-1">
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all duration-500 group-hover:bg-gold"
                    style={{ height: `${(m.value / maxMonth) * 100}%` }}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {formatRupiahShort(m.value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-mute" aria-hidden="true">
              {report.months.map((m) => (
                <span key={m.month} className="flex-1 text-center">{m.month}</span>
              ))}
            </div>
          </Reveal>

          {/* distribusi */}
          <Reveal delay={100} className="rounded-card bg-white p-7 shadow-soft">
            <h3 className="font-heading text-lg font-extrabold text-primary">Distribusi Dana {report.year}</h3>
            <div className="mt-6 space-y-4">
              {report.distribution.map((d) => (
                <div key={d.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink">{d.label}</span>
                    <span className="font-extrabold text-primary">{d.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-xl bg-softgreen p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-primary">
                Laporan keuangan diverifikasi berkala dan dapat diunduh oleh publik. Data diperbarui setiap bulan.
              </p>
            </div>

            <Link
              to="/yatim/transparansi"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3"
            >
              Lihat Laporan Lengkap
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
