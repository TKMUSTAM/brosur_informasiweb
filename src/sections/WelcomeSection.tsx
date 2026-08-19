import { Award, CheckCircle2, Quote } from 'lucide-react'
import Reveal from '../components/Reveal'
import { LogoEmblem } from '../components/Logo'
import { site } from '../data/site'

export default function WelcomeSection() {
  return (
    <section className="relative overflow-hidden bg-cream-dark/50 px-4 py-20 sm:px-6 sm:py-24" aria-label="Sambutan pimpinan yayasan">
      <div className="dot-grid pointer-events-none absolute right-0 top-10 h-64 w-64 opacity-30" />
      <div className="dot-grid pointer-events-none absolute bottom-0 left-0 h-64 w-64 opacity-30" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          
          {/* ===== Foto Pimpinan Yayasan (Fotografi Resmi) ===== */}
          <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              {/* Outer decorative gold border */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-gold/30 via-primary/10 to-transparent blur-md" />
              
              {/* Photo Frame */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-lift ring-1 ring-primary/10">
                <img
                  src="/images/content/ketua-yayasan.jpg"
                  alt="KH. Ahmad Mustam, S.Ag., M.Pd.I. - Pembina & Pendiri Yayasan Pendidikan Islam Al-Mustam"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/75 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-primary-deep shadow-soft">
                    <Award className="h-3.5 w-3.5" /> Pembina Yayasan
                  </span>
                  <p className="mt-1 font-heading text-lg font-extrabold">KH. Ahmad Mustam, S.Ag., M.Pd.I.</p>
                  <p className="text-xs text-white/80">Ulama &amp; Praktisi Pendidikan Islam</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 right-2 z-10 hidden animate-float rounded-2xl border border-primary/10 bg-white px-5 py-3 shadow-lift sm:block">
                <p className="text-xs font-extrabold text-primary">Sejak Tahun {site.foundedYear}</p>
                <p className="text-[11px] font-semibold text-ink-mute">Menebar Amanah &amp; Akhlak</p>
              </div>
            </div>
          </Reveal>

          {/* ===== Kutipan & Pesan Pimpinan ===== */}
          <Reveal delay={120}>
            <div className="flex flex-col gap-6">
              
              {/* Header pill */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-gold">
                  <Quote className="h-5 w-5" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Sambutan Pimpinan Yayasan
                </span>
              </div>

              {/* Quote Main */}
              <blockquote className="font-heading text-2xl font-extrabold leading-[1.35] text-primary sm:text-3xl lg:text-[2.2rem]">
                “Anak-anak bukan sekadar bejana kosong untuk diisi ilmu, melainkan{' '}
                <span className="text-gradient-gold">amanah suci</span> yang harus dibimbing fitrahnya agar tumbuh menjadi pribadi yang{' '}
                <span className="text-gradient-gold">beradab, berakhlaq mulia, dan beraqidah kokoh</span>.”
              </blockquote>

              {/* Description body */}
              <div className="space-y-3.5 text-sm leading-relaxed text-ink-soft sm:text-base">
                <p>
                  Di <strong>TK Islam Al-Mustam</strong>, kami memandang setiap anak sebagai individu istimewa yang memiliki potensi fitrah tak terbatas. Melalui perpaduan Kurikulum Merdeka yang menyenangkan, pembiasaan ibadah praktis, dan pendekatan kasih sayang guru, kami memastikan masa kanak-kanak buah hati Anda dipenuhi kegembiraan belajar dan keteladanan yang luhur.
                </p>
                <p>
                  Yayasan kami juga berkomitmen membuka akses seluas-luasnya melalui program pembinaan dan <strong>beasiswa 100% penuh bagi anak-anak yatim piatu dan dhuafa</strong>, agar mereka mendapatkan hak pendidikan terbaik berstandar unggul.
                </p>
              </div>

              {/* Poin Komitmen */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-mint" />
                  <span>Metode Belajar Sentra (BCCT) Terstandar</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-mint" />
                  <span>Laporan Tumbuh Kembang Berkala</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-mint" />
                  <span>Lingkungan Aman, Bersih &amp; Terpantau CCTV</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-mint" />
                  <span>Kemitraan Hangat Bersama Orang Tua</span>
                </div>
              </div>

              {/* Signature Card */}
              <div className="mt-2 flex items-center gap-4 border-t border-primary/10 pt-5">
                <LogoEmblem size={44} />
                <div>
                  <p className="font-heading text-base font-extrabold text-primary">KH. Ahmad Mustam, S.Ag., M.Pd.I.</p>
                  <p className="text-xs font-semibold text-ink-mute">Pembina Yayasan Pendidikan Islam Al-Mustam</p>
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
