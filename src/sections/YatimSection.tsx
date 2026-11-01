import { Phone } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { ButtonLink } from '../components/Buttons'
import { useCMS } from '../hooks/useCMS'

export default function YatimSection() {
  const { data } = useCMS()
  const site = data.site

  return (
    <section className="border-y border-white/10 bg-primary px-4 py-16 text-white sm:px-6 sm:py-20" aria-label="Program dukungan pendidikan yatim dan dhuafa">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            light
            eyebrow="Program Sosial Pendidikan"
            title="Akses belajar bagi anak yatim dan keluarga yang membutuhkan"
            subtitle="Yayasan menyediakan jalur pengajuan bantuan pendidikan. Cakupan bantuan ditetapkan setelah verifikasi dokumen dan ketersediaan dana program."
          />

          <div className="mt-7 border-l-2 border-gold pl-5 text-sm leading-relaxed text-white/80">
            Orang tua atau wali dapat berkonsultasi langsung dengan admin untuk mengetahui syarat, tahapan verifikasi, dan bantuan yang sedang tersedia.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/yatim" variant="gold" size="lg" withArrow>Informasi Program</ButtonLink>
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin berkonsultasi tentang program bantuan pendidikan yatim dan dhuafa di TK Islam Al-Mustam.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Konsultasi Persyaratan
            </a>
          </div>
        </div>

        <Reveal delay={100}>
          <figure className="border border-white/20 bg-primary-dark p-2">
            <img src="/images/content/prog-kb.jpg" alt="Kegiatan pendampingan belajar anak di TK Islam Al-Mustam" width="640" height="480" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <figcaption className="px-3 py-3 text-xs leading-relaxed text-white/70">Informasi bantuan diberikan melalui proses verifikasi resmi yayasan.</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
