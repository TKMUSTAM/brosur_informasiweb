import { MessageCircle } from 'lucide-react'
import { ButtonLink } from '../components/Buttons'
import Reveal from '../components/Reveal'
import { site } from '../data/site'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pt-14 lg:pb-24" aria-label="Hero">
      {/* Background ambient blurs & patterns */}
      <div className="dot-grid pointer-events-none absolute left-0 top-0 h-96 w-96 opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-softgreen/80 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-softyellow/80 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          
          {/* ===== Kiri: Copywriting & CTAs ===== */}
          <Reveal className="flex flex-col items-start gap-6 sm:gap-7">
            {/* Accreditation Eyebrow */}
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-primary/75">
              Terakreditasi A (Unggul) • NPSN: {site.npsn}
            </p>

            {/* Main Headline */}
            <h1 className="font-heading text-[2.4rem] font-extrabold leading-[1.12] text-primary sm:text-5xl lg:text-[3.8rem]">
              Membentuk Generasi{' '}
              <span className="relative inline-block text-gradient-gold">
                Qur’ani
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 Q100 -2 198 6" stroke="#E5B235" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              , Beradab, &amp;{' '}
              <span className="text-primary-light">Cerdas Holistik</span>.
            </h1>

            {/* Sub-headline */}
            <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Rumah kedua yang hangat dan terpercaya bagi tumbuh kembang anak usia dini (KB, TK A, TK B, &amp; TPA). 
              Memadukan <strong>Kurikulum Merdeka</strong> dengan <strong>Tahfidz Juz 30</strong> dan <strong>7 Pilar Karakter Islami</strong>.
            </p>

            {/* Quick Benefits Points */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold text-ink-soft sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                Rasio Kelas Nyaman 1:7
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                Metode Sentra (BCCT) Terpadu
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                Guru S1 PAUD &amp; Hafidzah
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                Beasiswa Yatim &amp; Dhuafa 100%
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ButtonLink to="/ppdb/daftar" variant="primary" size="lg" withArrow className="shadow-lift">
                Daftar PPDB 2026/2027
              </ButtonLink>
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi pendaftaran TK Islam Al-Mustam.')}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-soft transition-all duration-300 hover:border-primary hover:bg-softgreen/50 hover:shadow-lift"
              >
                <MessageCircle className="h-4.5 w-4.5 text-primary transition-transform group-hover:scale-110" />
                Konsultasi WhatsApp
              </a>
            </div>

            {/* Quick Stat Bar */}
            <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-4 border-t border-primary/10 pt-5 sm:justify-start sm:gap-10">
              <div>
                <p className="font-heading text-2xl font-black text-primary sm:text-3xl">180+</p>
                <p className="text-xs font-semibold text-ink-mute">Siswa Aktif</p>
              </div>
              <div className="h-8 w-px bg-primary/10" aria-hidden="true" />
              <div>
                <p className="font-heading text-2xl font-black text-primary sm:text-3xl">100%</p>
                <p className="text-xs font-semibold text-ink-mute">Kesiapan Masuk SD</p>
              </div>
              <div className="h-8 w-px bg-primary/10" aria-hidden="true" />
              <div>
                <p className="font-heading text-2xl font-black text-primary sm:text-3xl">35+</p>
                <p className="text-xs font-semibold text-ink-mute">Anak Yatim Terbina</p>
              </div>
            </div>
          </Reveal>

          {/* ===== Kanan: High-End Photography Frame ===== */}
          <Reveal delay={150} className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative">
              {/* Outer Subtle Ambient Glow */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-gold/20 via-primary/10 to-primary-mint/15 blur-2xl opacity-60" />
              
              {/* Main Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-lift ring-1 ring-primary/15">
                <img
                  src="/images/content/hero-school.jpg"
                  alt="Suasana ceria belajar anak-anak di TK Islam Al-Mustam bersama guru yang ramah"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
