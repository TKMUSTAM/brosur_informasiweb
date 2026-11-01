import Reveal from '../components/Reveal'
import { useCMS } from '../hooks/useCMS'

export default function WelcomeSection() {
  const { data } = useCMS()
  const welcome = data.pageContent.welcome

  return (
    <section className="border-y border-primary/10 bg-cream-dark/45 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="welcome-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <Reveal>
          <figure className="border border-primary/15 bg-white p-2">
            <img src={welcome.image} alt={welcome.imageAlt} width="560" height="700" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <figcaption className="px-3 py-3">
              <p className="font-heading text-sm font-extrabold text-primary">{welcome.personName}</p>
              <p className="mt-1 text-xs text-ink-mute">{welcome.personRole}</p>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100}>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-primary/75">
            <span className="h-px w-8 bg-gold-dark" aria-hidden="true" />
            {welcome.eyebrow}
          </p>
          <h2 id="welcome-title" className="mt-5 max-w-3xl text-balance font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">{welcome.title}</h2>
          <blockquote className="mt-7 border-l-2 border-gold pl-5 font-heading text-xl font-bold leading-relaxed text-primary sm:text-2xl">“{welcome.quote}”</blockquote>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft">{welcome.body}</p>
        </Reveal>
      </div>
    </section>
  )
}
