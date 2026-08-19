import { FileCheck2, ScrollText, Award, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { legalitas } from '../data/content'
import { site } from '../data/site'

export default function Legalitas() {
  useSEO({
    title: 'Legalitas & Akreditasi Resmi — Yayasan & TK Islam Al-Mustam',
    description: 'Dokumen legalitas dan akreditasi resmi Yayasan Pendidikan Islam Al-Mustam: Akreditasi A, NPSN, SK Kemenkumham, dan Izin Operasional Disdik.',
    path: '/legalitas',
  })

  return (
    <>
      <PageHeader
        eyebrow="Legalitas &amp; Akreditasi"
        title="Lembaga Resmi, Terakreditasi &amp; Amanah"
        description={`${site.name} beroperasi secara legal dan terdaftar resmi di Kementerian Pendidikan Dasar & Menengah RI, Kementerian Agama RI, serta Kementerian Hukum dan HAM RI.`}
        crumbs={[{ label: 'Profil Yayasan', href: '/profil' }, { label: 'Legalitas & Akreditasi' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          
          {/* Header Banner Kepatuhan Hukum */}
          <Reveal className="mb-12 flex items-start gap-5 rounded-3xl border border-primary/15 bg-softgreen p-7 shadow-soft sm:p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-gold shadow-soft">
              <Award className="h-8 w-8" />
            </span>
            <div>
              <span className="rounded-full bg-primary px-3 py-0.5 text-[11px] font-extrabold text-gold-light">
                Status Akreditasi Unggul
              </span>
              <h2 className="mt-2 font-heading text-xl font-extrabold text-primary sm:text-2xl">
                Komitmen Akuntabilitas, Legalitas &amp; Kepatuhan Regulasi
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Sebagai wujud tanggung jawab publik kepada wali murid dan donatur, seluruh dokumen hukum, nomor pokok sekolah nasional, akta notaris, dan rekening resmi yayasan dapat diverifikasi secara transparan.
              </p>
            </div>
          </Reveal>

          {/* Grid Dokumen Legalitas */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {legalitas.map((l, i) => (
              <Reveal key={l.title} delay={i * 70} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-primary transition-transform duration-300 group-hover:scale-110">
                      {i === 0 ? <Award className="h-6 w-6 text-gold-dark" /> : i % 2 === 0 ? <FileCheck2 className="h-6 w-6" /> : <ScrollText className="h-6 w-6" />}
                    </span>
                    <h3 className="mt-5 font-heading text-base font-extrabold text-primary">{l.title}</h3>
                    <p className="mt-1 text-sm font-black text-ink">{l.value}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-mute">{l.note}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 border-t border-primary/5 pt-4 text-xs font-bold text-primary-mint">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Terverifikasi Sah</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      <CTASection
        title={<>Butuh Informasi Legalitas Tambahan?</>}
        description="Sekretariat kami siap melayani verifikasi dokumen dan korespondensi resmi kelembagaan."
        primaryLabel="Hubungi Sekretariat"
        primaryTo="/kontak"
      />
    </>
  )
}
