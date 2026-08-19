import { Heart, Sparkles, Award, Phone } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { ButtonLink } from '../components/Buttons'
import { site } from '../data/site'

const stats = [
  { value: '100%', label: 'Bebas Biaya Yatim', icon: Award },
  { value: '35+', label: 'Santri Binaan', icon: Heart },
  { value: '12', label: 'Tenaga Pendidik', icon: Sparkles },
]

export default function YatimSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 text-white sm:px-6 sm:py-28" aria-label="Program pembinaan yatim piatu">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-light/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="dot-grid pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-20" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Sisi Kiri: Deskripsi Program */}
          <div>
            <SectionHeading
              align="left"
              light
              eyebrow="Kepedulian Sosial &amp; Umat"
              title={
                <>
                  Membuka Asa &amp; Masa Depan{' '}
                  <span className="text-gold">Anak Yatim &amp; Dhuafa.</span>
                </>
              }
              subtitle="Yayasan &amp; TK Islam Al-Mustam berkomitmen menyediakan beasiswa penuh 100% biaya pendidikan dan pembinaan akhlak bagi anak yatim piatu."
            />

            {/* Statistik Binaan */}
            <div className="mt-10 grid grid-cols-3 gap-3.5 sm:gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 100} className="h-full">
                  <div className="flex h-full flex-col justify-center rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                    <s.icon className="mx-auto mb-2 h-5 w-5 text-gold" />
                    <p className="font-heading text-2xl font-black text-white sm:text-3xl">{s.value}</p>
                    <p className="mt-1 text-[11px] font-bold text-white/75 sm:text-xs">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/yatim" variant="gold" size="lg" withArrow className="shadow-lift">
                Pelajari Program Beasiswa
              </ButtonLink>
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin konsultasi terkait program beasiswa anak yatim / orang tua asuh di TK Islam Al-Mustam.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span>Konsultasi Program</span>
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-white/70">
              <Heart className="h-4 w-4 fill-gold text-gold" />
              <span>Program beasiswa mencakup SPP, seragam lengkap, buku materi, dan konseling tumbuh kembang.</span>
            </p>
          </div>

          {/* Sisi Kanan: Visual Card */}
          <Reveal delay={150} className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-3 shadow-lift backdrop-blur-md">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-primary-deep">
                <img
                  src="/images/content/prog-kb.jpg"
                  alt="Pembinaan anak yatim TK Islam Al-Mustam"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-primary-deep">
                    Beasiswa Penuh 100%
                  </span>
                  <p className="mt-2 text-sm font-extrabold text-white">
                    Mendukung Hak Setiap Anak Mendapat Pendidikan Terbaik
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
