import { Eye, Target, Compass, CheckCircle2, Heart, Sparkles, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { pillars } from '../data/content'
import PillarCard from '../components/cards/PillarCard'
import { site } from '../data/site'

const misi = [
  'Menyelenggarakan pendidikan anak usia dini (PAUD/TK) Islam berkualitas berpusat pada anak dengan pendekatan kasih sayang dan keteladanan.',
  'Menanamkan aqidah yang lurus, pembiasaan sholat dhuha, tahfidz Juz 30, serta hafalan doa harian sejak dini.',
  'Mengembangkan potensi fitrah anak secara holistik: kecerdasan intelektual, kemandirian motorik, dan kepekaan sosial.',
  'Menyelenggarakan program beasiswa penuh 100% dan pembinaan berkelanjutan bagi anak-anak yatim piatu dan dhuafa.',
  'Membangun kemitraan harmonis dan transparan dengan orang tua sebagai pilar utama pendidikan anak.',
  'Mengelola yayasan secara amanah, profesional, taat hukum, dan berstandar mutu nasional.',
]

const filosofi = [
  {
    icon: Heart,
    title: 'Mendidik dengan Hati & Kasih Sayang',
    desc: 'Anak berkembang optimal saat merasa aman, dicintai tanpa syarat, dan dihargai keunikan fitrahnya.',
  },
  {
    icon: Sparkles,
    title: 'Bermain Bermakna (*Playful Learning*)',
    desc: 'Bermain adalah cara alami anak mengeksplorasi ciptaan Allah, mengasah kreativitas, dan membangun logika.',
  },
  {
    icon: Compass,
    title: 'Keteladanan di Atas Perkataan (*Uswah*)',
    desc: 'Nilai-nilai adab paling kuat tertanam melalui figur guru dan orang tua yang konsisten memberi teladan nyata.',
  },
]

export default function VisiMisi() {
  useSEO({
    title: `Visi, Misi & 7 Pilar Karakter — ${site.name}`,
    description: `Visi, misi, dan filosofi pendidikan ${site.name}: membentuk generasi Qur’ani yang beradab, berakhlak mulia, dan cerdas holistik.`,
    path: '/visi-misi',
  })

  return (
    <>
      <PageHeader
        eyebrow="Visi, Misi &amp; Nilai Inti"
        title="Landasan Arah &amp; Semangat Perjuangan Kami"
        description="Prinsip dasar yang menuntun setiap kurikulum, interaksi guru, dan kebijakan pendidikan di Yayasan &amp; TK Islam Al-Mustam."
        crumbs={[{ label: 'Profil Yayasan', href: '/profil' }, { label: 'Visi, Misi & Nilai' }]}
      />

      {/* ===== VISI & MISI ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Box Visi */}
            <Reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary/20 bg-primary p-8 text-white shadow-lift sm:p-12">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold">
                  <Eye className="h-7 w-7" />
                </span>
                <span className="mt-6 inline-block rounded-full bg-gold px-3.5 py-1 text-xs font-extrabold text-primary-deep">
                  Visi Utama Lembaga
                </span>
                <h2 className="mt-3 font-heading text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                  Visi Yayasan &amp; TK Islam Al-Mustam
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  “Menjadi lembaga pendidikan Islam unggulan yang melahirkan generasi{' '}
                  <span className="font-extrabold text-gold">Qur’ani, beradab, berakhlaqul karimah, dan cerdas holistik</span>, serta membawa manfaat luas bagi umat dan bangsa.”
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-gold-light">
                <ShieldCheck className="h-4 w-4" />
                <span>Terakreditasi A &amp; Berorientasi Mutu Global</span>
              </div>
            </Reveal>

            {/* Box Misi */}
            <Reveal delay={100} className="flex flex-col items-start gap-6 rounded-3xl border border-primary/10 bg-softgreen/60 p-8 shadow-soft sm:p-12">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-gold">
                  <Target className="h-7 w-7" />
                </span>
                <span className="mt-6 inline-block rounded-full bg-primary px-3.5 py-1 text-xs font-extrabold text-white">
                  Langkah Strategis
                </span>
                <h2 className="mt-3 font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                  Misi Lembaga
                </h2>
              </div>

              <ul className="space-y-3">
                {misi.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-xs leading-relaxed text-ink sm:text-sm">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-mint" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ===== FILOSOFI PENDIDIKAN ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Filosofi pendidikan">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Filosofi Belajar"
            title="Cara Kami Memandang &amp; Menumbuhkan Anak"
            subtitle="Tiga keyakinan mendasar yang mewarnai setiap interaksi guru dan santri setiap hari."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {filosofi.map((f, i) => (
              <Reveal key={f.title} delay={i * 100} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform duration-300 group-hover:scale-110">
                      <f.icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-heading text-xl font-extrabold text-primary">{f.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7 PILAR KARAKTER ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="7 Pilar Nilai">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Karakter Unggulan"
            title="7 Pilar Nilai yang Ditanamkan Setiap Hari"
            subtitle="Membentuk santri yang kuat aqidahnya, santun perilakunya, dan tangkas kemandiriannya."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pillars.map((p, i) => (
              <div key={p.number} className={i === 6 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''}>
                <PillarCard index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Mari Wujudkan Generasi Qur’ani Bersama Kami</>}
        description="Daftarkan ananda di TK Islam Al-Mustam atau konsultasikan kebutuhan pendidikannya sekarang."
        primaryLabel="Daftar PPDB Online"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Hubungi Kami"
        secondaryTo="/kontak"
      />
    </>
  )
}
