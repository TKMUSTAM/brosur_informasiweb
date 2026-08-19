import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Moon, Sparkles, Quote } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { PrayerTimesGrid } from '../components/PrayerSchedule'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { islamicArticles, haditsList } from '../data/content'

export default function KontenIslami() {
  useSEO({
    title: 'Konten Islami & Mutiara Sunnah — Yayasan & TK Islam Al-Mustam',
    description: 'Kumpulan doa harian anak, hadits adab pilihan, jadwal sholat, dan artikel parenting Islami dari TK Islam Al-Mustam.',
    path: '/konten-islami',
  })

  return (
    <>
      <PageHeader
        eyebrow="Khazanah Islami"
        title="Mutiara Sunnah, Doa Harian &amp; Inspirasi Keluarga"
        description="Bahan ajar dan panduan praktis untuk mendampingi buah hati membiasakan dzikir, doa harian, dan akhlak mulia di rumah."
        crumbs={[{ label: 'Konten Islami' }]}
      />

      {/* ===== DOA + JADWAL SHOLAT ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Doa dan jadwal sholat">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-2">
          
          {/* Box Doa Harian */}
          <Reveal className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-softgreen p-8 shadow-soft sm:p-10">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-gold shadow-soft">
                <Sparkles className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-extrabold text-primary">Doa Harian &amp; Dzikir Anak</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Koleksi doa sehari-hari dengan teks Arab berharakat, transliterasi latin, terjemahan, dan keutamaan amalan.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/doa" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift">
                <span>Buka Kumpulan Doa Lengkap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {/* Box Jadwal Sholat */}
          <Reveal delay={100} className="flex flex-col justify-between rounded-3xl border border-secondary/15 bg-softblue p-8 shadow-soft sm:p-10">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-soft">
                  <Moon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-secondary-dark shadow-soft">
                  Waktu Sholat Hari Ini
                </span>
              </div>
              <h2 className="mt-5 font-heading text-2xl font-extrabold text-secondary-dark">Jadwal Sholat Real-Time</h2>
              <div className="mt-6">
                <PrayerTimesGrid />
              </div>
            </div>
            <div className="mt-8">
              <Link to="/jadwal-sholat" className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-secondary-dark">
                <span>Lihat Jadwal Sholat Bulanan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ===== HADITS ADAB PILIHAN ANAK ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Hadits Adab">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Hadits Pilihan"
            title="Hadits Adab &amp; Akhlak Ramah Anak"
            subtitle="Hadits-hadits shahih pendek yang mudah dihafal santri di kelas dan dipraktikkan di rumah."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {haditsList.map((h, i) => (
              <Reveal key={h.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-softyellow px-3 py-1 text-xs font-extrabold text-gold-ink">
                        {h.narrator}
                      </span>
                      <Quote className="h-4 w-4 text-gold-dark" />
                    </div>
                    <h3 className="mt-4 font-heading text-base font-extrabold text-primary sm:text-lg">
                      {h.title}
                    </h3>
                    <p dir="rtl" className="mt-4 text-right font-heading text-xl font-bold leading-loose text-primary">
                      {h.arabic}
                    </p>
                    <p className="mt-2 text-xs italic text-ink-mute">{h.latin}</p>
                    <p className="mt-3 text-xs leading-relaxed text-ink-soft sm:text-sm font-medium">
                      "{h.meaning}"
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ARTIKEL PARENTING ISLAMI ===== */}
      <section id="artikel" className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Artikel parenting">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Edukasi Keluarga"
            title="Artikel &amp; Panduan Parenting Islami"
            subtitle="Wawasan pengasuhan anak usia dini berdasarkan teladan Nabawiyah dan psikologi modern."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {islamicArticles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90} className="h-full">
                <article className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-softgreen px-3 py-1 text-[11px] font-extrabold text-primary">{a.category}</span>
                      <span className="text-xs font-semibold text-ink-mute">{a.readTime} baca</span>
                    </div>
                    <h3 className="font-heading text-lg font-extrabold leading-snug text-primary transition-colors group-hover:text-primary-light">
                      {a.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft sm:text-sm">{a.excerpt}</p>
                    
                    <div className="mt-5 space-y-2 border-t border-primary/5 pt-4">
                      {a.content.slice(0, 2).map((c) => (
                        <p key={c} className="flex items-start gap-2 text-xs leading-relaxed text-ink-mute">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {c}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KUTIPAN NABAWI ===== */}
      <section className="px-4 pb-16 sm:px-6" aria-label="Kutipan">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-primary p-10 text-center text-white shadow-lift sm:p-14">
          <BookOpen className="mx-auto mb-5 h-10 w-10 text-gold" />
          <blockquote className="font-heading text-xl font-extrabold leading-relaxed sm:text-2xl">
            “Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya.”
            <span className="mt-3 block text-xs font-semibold text-gold-light">— Hadits Riwayat Imam Bukhari</span>
          </blockquote>
        </Reveal>
      </section>

      <CTASection title={<>Mari Tumbuhkan Generasi Berakhlak Mulia</>} />
    </>
  )
}
