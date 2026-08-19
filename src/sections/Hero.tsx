import { Award, CheckCircle, Heart, MessageCircle, ShieldCheck, Sparkles, Star } from 'lucide-react'
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
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/90 px-4 py-1.5 shadow-soft backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-primary-deep">
                <Award className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-extrabold tracking-wide text-primary sm:text-sm">
                Terakreditasi A (Unggul) • NPSN: {site.npsn}
              </span>
            </div>

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

            {/* Quick Benefits Bullet points */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-ink-soft sm:text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-mint" />
                Rasio Kelas Nyaman 1:7
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-mint" />
                Metode Sentra (BCCT) Terpadu
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-mint" />
                Guru S1 PAUD &amp; Hafidzah
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-mint" />
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

          {/* ===== Kanan: High-End Photography & Bento Badges ===== */}
          <Reveal delay={150} className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative">
              
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-gold/30 via-primary/10 to-primary-mint/20 blur-xl" />
              
              {/* Main Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-lift ring-1 ring-primary/10">
                <img
                  src="/images/content/hero-school.jpg"
                  alt="Suasana ceria belajar anak-anak di TK Islam Al-Mustam bersama guru yang ramah"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/60 via-transparent to-transparent" />
                
                {/* Bottom caption over photo */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 rounded-xl bg-primary-deep/80 px-3.5 py-1.5 backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="text-xs font-bold">Ruang Belajar Ceria &amp; Ber-AC</span>
                  </div>
                  <span className="text-xs font-semibold text-white/90">TK Islam Al-Mustam</span>
                </div>
              </div>

              {/* Floating Badge 1: Top Left */}
              <div className="absolute -left-3 -top-5 z-20 animate-float rounded-2xl border border-primary/10 bg-white/95 p-3.5 shadow-lift backdrop-blur-md sm:-left-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
                    <Star className="h-5 w-5 fill-gold text-gold" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-primary">Tahfidz Juz 30</p>
                    <p className="text-[11px] font-semibold text-ink-mute">Metode Tilawati Ramah Anak</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right */}
              <div className="absolute -bottom-6 -right-3 z-20 animate-float-slow rounded-2xl border border-primary/10 bg-white/95 p-3.5 shadow-lift backdrop-blur-md sm:-right-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softred text-warmred">
                    <Heart className="h-5 w-5 fill-warmred text-warmred" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-primary">Peduli Anak Yatim</p>
                    <p className="text-[11px] font-semibold text-ink-mute">Beasiswa Penuh Pendidikan</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 3: Top Right Pill */}
              <div className="absolute -right-2 top-8 z-20 hidden rounded-full border border-primary/10 bg-primary px-3.5 py-1.5 text-white shadow-soft backdrop-blur-md sm:flex sm:items-center sm:gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold">CCTV &amp; Lingkungan Aman</span>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
