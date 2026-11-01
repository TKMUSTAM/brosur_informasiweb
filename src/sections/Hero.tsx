import { MessageCircle } from 'lucide-react'
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

          <h1 id="hero-title" className="mt-6 text-balance font-heading text-[2.45rem] font-extrabold leading-[1.08] text-primary sm:text-5xl lg:text-[3.65rem]">
            {hero.title} <span className="text-gold-dark">{hero.highlight}</span> {hero.titleSuffix}
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">{hero.description}</p>

          <ul className="mt-7 grid gap-x-8 gap-y-3 border-y border-primary/10 py-5 text-sm font-semibold text-ink-soft sm:grid-cols-2">
            {hero.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {data.pageContent.ppdb.registrationOpen && (
              <ButtonLink to="/ppdb/daftar" variant="primary" size="lg" withArrow>
                {hero.primaryLabel} {data.pageContent.ppdb.academicYear}
              </ButtonLink>
            )}
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi pendaftaran TK Islam Al-Mustam.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-6 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-softgreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              Konsultasi WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:justify-self-end">
          <figure className="overflow-hidden border border-primary/15 bg-white p-2 shadow-soft">
            <img src={hero.image} alt={hero.imageAlt} width="720" height="540" fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
            <figcaption className="flex flex-col gap-1 px-3 py-3 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
              <span>{site.name}</span>
              <span>{site.accreditation}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
