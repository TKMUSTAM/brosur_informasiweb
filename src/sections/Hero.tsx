import { RiCheckLine } from 'react-icons/ri'
import { FaWhatsapp } from 'react-icons/fa6'
import { ButtonLink } from '../components/Buttons'
import Reveal from '../components/Reveal'
import { useCMS } from '../hooks/useCMS'

export default function Hero() {
  const { data } = useCMS()
  const { site } = data
  const hero = data.pageContent.hero

  return (
    <section className="border-b border-primary/10 bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:py-20" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.85fr)] lg:gap-16">
        <Reveal className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-primary/75 sm:text-sm">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="mt-5 text-balance font-heading text-[2.35rem] font-extrabold leading-[1.1] text-primary sm:text-5xl lg:text-[3.5rem]">
            {hero.title} <span className="text-gold-dark">{hero.highlight}</span> {hero.titleSuffix}
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ink-soft sm:text-base lg:text-lg">
            {hero.description}
          </p>

          <ul className="mt-6 grid gap-x-8 gap-y-2.5 border-y border-primary/10 py-4 text-xs sm:text-sm font-semibold text-ink-soft sm:grid-cols-2">
            {hero.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5">
                <RiCheckLine className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {data.pageContent.ppdb.registrationOpen && (data.pageContent.ppdb.waves?.some((w) => w.status === 'OPEN') ?? true) ? (
              <ButtonLink to="http://localhost:5175/daftar" variant="primary" size="lg" withArrow className="shadow-lift font-bold">
                {hero.primaryLabel} {data.pageContent.ppdb.academicYear}
              </ButtonLink>
            ) : (
              <ButtonLink to="/ppdb" variant="outline" size="lg" className="border-primary/20 text-ink font-bold hover:bg-cream">
                Lihat Informasi PPDB (Pendaftaran Ditutup)
              </ButtonLink>
            )}
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin konsultasi pendaftaran TK Islam Al-Mustam.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-6 text-xs sm:text-sm font-bold text-primary transition-all hover:border-primary hover:bg-softgreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold shadow-xs"
            >
              <FaWhatsapp className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:justify-self-end w-full">
          <figure className="overflow-hidden rounded-2xl border border-primary/15 bg-white p-2.5 shadow-lift">
            <img
              src={hero.image}
              alt={hero.imageAlt}
              width="720"
              height="540"
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
            <figcaption className="px-3 py-3 border-t border-primary/5 mt-1 text-xs text-ink-soft">
              Pendidikan usia dini berbasis Kurikulum Merdeka &amp; adab Islami di TK Islam Al-Mustam.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
