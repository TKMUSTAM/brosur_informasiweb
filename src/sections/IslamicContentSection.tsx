import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { PrayerTimesGrid } from '../components/PrayerSchedule'
import { doas, islamicArticles } from '../data/content'

export default function IslamicContentSection() {
  const doa = doas[0]
  const article = islamicArticles[0]

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24" aria-label="Konten Islami">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Konten Islami"
          title="Belajar Kebaikan Setiap Hari"
          subtitle="Doa, jadwal sholat, dan artikel parenting Islami untuk menemani tumbuh kembang buah hati."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Doa hari ini */}
          <Reveal>
            <Link to="/doa" className="group flex h-full flex-col overflow-hidden rounded-card bg-softgreen p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon name="pray" className="h-6 w-6 text-gold" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Doa Hari Ini</p>
              <h3 className="mt-1.5 font-heading text-xl font-extrabold text-primary">{doa.title}</h3>
              <p dir="rtl" className="mt-4 text-right font-heading text-lg font-bold leading-relaxed text-primary">
                {doa.arabic}
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-ink-soft">{doa.latin}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary transition-all group-hover:gap-3">
                Baca Doa Harian <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          {/* Jadwal sholat */}
          <Reveal delay={100}>
            <Link to="/jadwal-sholat" className="group flex h-full flex-col rounded-card bg-softblue p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon name="moon" className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-secondary-dark">Lokasi Anda</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-dark">Jadwal Sholat</p>
              <h3 className="mt-1.5 font-heading text-xl font-extrabold text-secondary-dark">Waktu Sholat Hari Ini</h3>
              <div className="mt-5">
                <PrayerTimesGrid compact />
              </div>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-secondary-dark transition-all group-hover:gap-3">
                Jadwal Lengkap <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          {/* Artikel parenting */}
          <Reveal delay={200}>
            <Link to="/konten-islami" className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <div className="relative overflow-hidden">
                <svg viewBox="0 0 320 140" className="aspect-[16/7] w-full transition-transform duration-500 group-hover:scale-105" role="img" aria-label="Ilustrasi parenting">
                  <rect width="320" height="140" fill="#FFF5C9" />
                  <circle cx="270" cy="30" r="24" fill="#F4C542" opacity="0.8" />
                  <circle cx="60" cy="112" r="16" fill="#F2C79B" />
                  <rect x="48" y="118" width="24" height="20" rx="10" fill="#124B3A" />
                  <path d="M48 122 Q60 108 72 122" fill="#124B3A" />
                  <rect x="230" y="116" width="26" height="22" rx="10" fill="#3D82C6" />
                  <circle cx="243" cy="108" r="10" fill="#F2C79B" />
                  <path d="M120 88 q-10 6 -6 18 M120 88 q10 6 6 18" stroke="#124B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M96 92 L96 108 M120 90 L120 108" stroke="#124B3A" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M150 94 Q158 88 166 94" stroke="#C0544E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  <circle cx="143" cy="90" r="2" fill="#2A1A0E" />
                  <circle cx="157" cy="90" r="2" fill="#2A1A0E" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-7">
                <span className="w-fit rounded-full bg-softyellow px-3 py-1 text-[11px] font-bold text-gold-ink">{article.category}</span>
                <h3 className="font-heading text-lg font-extrabold leading-snug text-primary">{article.title}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-primary transition-all group-hover:gap-3">
                  Baca Artikel <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/konten-islami"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-light hover:shadow-lift sm:text-base"
          >
            <Icon name="read" className="h-5 w-5 text-gold" />
            Jelajahi Konten Islami
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
