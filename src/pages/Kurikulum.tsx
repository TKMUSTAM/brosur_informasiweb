import { Check, Clock, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { curriculumGroups, curriculumItems, sentraList, dailyRoutines } from '../data/programs'

export default function Kurikulum() {
  useSEO({
    title: 'Kurikulum & Metode Sentra (BCCT) — TK Islam Al-Mustam',
    description: 'Kurikulum Merdeka integratif dengan nilai Qur’ani, 5 Sentra Pembelajaran (BCCT), Tahfidz Juz 30, dan persiapan transisi SD unggulan.',
    path: '/kurikulum',
  })

  return (
    <>
      <PageHeader
        eyebrow="Kurikulum &amp; Pembelajaran"
        title="Belajar dengan Ilmu, Tumbuh dengan Adab Qur’ani"
        description="Memadukan Kurikulum Merdeka PAUD dengan muatan diniyah dan metode sentra (Beyond Centers and Circle Time), membentuk kecerdasan intelektual, emosional, dan spiritual secara seimbang."
        crumbs={[{ label: 'Program Pendidikan', href: '/program' }, { label: 'Kurikulum' }]}
      />

      {/* ===== PENGENALAN KURIKULUM ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Foto Nyata Dokumentasi Kelas */}
            <Reveal>
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white bg-cream shadow-lift ring-1 ring-primary/10">
                  <img
                    src="/images/content/hero-school.jpg"
                    alt="Pembelajaran aktif di sentra TK Islam Al-Mustam"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-3 animate-float rounded-2xl border border-primary/10 bg-white p-4 shadow-lift sm:-right-6">
                  <p className="text-xs font-extrabold text-primary">Kurikulum Merdeka + Diniyah</p>
                  <p className="text-[11px] font-semibold text-ink-mute">Pembelajaran Berpusat Pada Anak</p>
                </div>
              </div>
            </Reveal>

            {/* Uraian Pendekatan */}
            <Reveal delay={100} className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                eyebrow="Filosofi Belajar"
                title="Menumbuhkan Cinta Belajar Seumur Hidup"
                className="max-w-none"
              />
              <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                Kami percaya bahwa anak usia dini belajar paling efektif melalui <strong>pengalaman nyata (*hands-on experience*) dan bermain bermakna</strong>. Oleh karena itu, pendekatan pembelajaran kami dirancang agar anak tidak merasa tertekan, melainkan antusias mengeksplorasi ilmu pengetahuan, menghafal Al-Qur’an dengan ceria, dan mempraktikkan adab mulia dalam pergaulan sehari-hari.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {curriculumGroups.map((g) => (
                  <span key={g.title} className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-bold text-primary shadow-soft">
                    <Icon name={g.icon} className="h-4 w-4 text-gold-dark" />
                    {g.title}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <ButtonLink to="/ppdb/daftar" variant="primary" withArrow>
                  Daftar Sekarang
                </ButtonLink>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ===== 5 SENTRA PEMBELAJARAN (BCCT) ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="5 Sentra Pembelajaran">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Metode Unggulan"
            title="5 Sentra Pembelajaran Tematik (BCCT)"
            subtitle="Anak berotasi belajar di sentra-sentra tematik dengan media pembelajaran konkret dan bimbingan guru ahli."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sentraList.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="inline-block rounded-full bg-softgreen px-3 py-1 text-[11px] font-extrabold text-primary">
                      {s.badge}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-extrabold text-primary">{s.name}</h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft sm:text-sm">{s.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary-mint">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Sentra Pilihan</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10 KOMPETENSI INTI ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="10 Kompetensi Inti">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Capaian Pembelajaran"
            title="10 Aspek Perkembangan &amp; Kompetensi Inti Anak"
            subtitle="Asesmen holistik yang dipantau dan dilaporkan secara berkala dalam buku raport perkembangan anak."
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {curriculumItems.map((item, i) => (
              <Reveal as="li" key={item.label} delay={i * 40} className="group flex flex-col justify-between rounded-3xl border border-primary/10 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform group-hover:scale-110">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <Check className="h-4 w-4 text-primary-mint" strokeWidth={3} />
                </div>
                <p className="mt-4 font-heading text-sm font-bold text-ink">{item.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== JADWAL RUTINITAS HARIAN ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Jadwal harian">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Aktivitas Harian"
            title="Jadwal Rutinitas Harian Santri (07.15 – 11.30 WIB)"
            subtitle="Ritme harian yang teratur membentuk disiplin alami, kenyamanan emosi, dan kemandirian anak."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyRoutines.map((r, i) => (
              <Reveal key={r.time} delay={i * 60}>
                <div className="flex h-full flex-col rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-extrabold text-white">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      {r.time}
                    </span>
                    <span className="font-heading text-sm font-black text-primary/25">0{i + 1}</span>
                  </div>
                  <h3 className="mt-3 font-heading text-base font-extrabold text-primary">{r.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Kurikulum Terbaik untuk Buah Hati Anda</>}
        description="Konsultasikan kesiapan belajar ananda bersama tim psikolog dan pendidik TK Islam Al-Mustam."
        primaryLabel="Daftar PPDB Sekarang"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Lihat Rincian Biaya"
        secondaryTo="/ppdb#syarat"
      />
    </>
  )
}
