import { FaWhatsapp } from 'react-icons/fa6'
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
            title="Akses Belajar Penuh bagi Anak Yatim &amp; Dhuafa"
            subtitle="Yayasan menyediakan jalur beasiswa bebas biaya 100% dari infak donatur. Seluruh murid berhak mendapatkan pendidikan berkualitas dengan penuh kasih sayang."
          />

          <div className="mt-7 border-l-2 border-gold pl-5 text-xs sm:text-sm leading-relaxed text-white/85 bg-white/5 py-3 pr-4 rounded-r-xl">
            Orang tua atau wali dapat berkonsultasi langsung dengan admin untuk mengetahui syarat administrasi dan ketersediaan kuota beasiswa.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/yatim" variant="gold" size="lg" withArrow className="font-bold">
              Informasi Program Beasiswa
            </ButtonLink>
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin berkonsultasi tentang program bantuan pendidikan yatim dan dhuafa di TK Islam Al-Mustam.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <FaWhatsapp className="h-4 w-4 text-gold-light" aria-hidden="true" />
              Konsultasi Persyaratan
            </a>
          </div>
        </div>

        <Reveal delay={100} className="w-full">
          <figure className="rounded-2xl border border-white/20 bg-primary-dark p-2.5 shadow-lift overflow-hidden">
            <img
              src="/images/content/prog-kb.jpg"
              alt="Kegiatan pendampingan belajar murid di TK Islam Al-Mustam"
              width="640"
              height="480"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
            <figcaption className="px-3 py-3 text-xs leading-relaxed text-white/70 border-t border-white/10 mt-1">
              Penyaluran beasiswa pendidikan yatim didanai amanah infak yayasan.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
