import Reveal from '../Reveal'
import { pillars } from '../../data/content'

const cardStyles: Record<string, { tag: string; border: string; number: string }> = {
  green: {
    tag: 'text-primary',
    border: 'border-primary/15',
    number: 'text-primary/20',
  },
  red: {
    tag: 'text-warmred',
    border: 'border-warmred/20',
    number: 'text-warmred/20',
  },
  gold: {
    tag: 'text-gold-ink',
    border: 'border-gold/35',
    number: 'text-gold-dark/25',
  },
  blue: {
    tag: 'text-secondary',
    border: 'border-secondary/20',
    number: 'text-secondary/20',
  },
}

export default function PillarCard({ index = 0 }: { index?: number }) {
  const pillar = pillars[index] ?? pillars[0]
  const style = cardStyles[pillar.color] ?? cardStyles.green

  return (
    <Reveal delay={index * 80} className="h-full">
      <article
        className={`relative flex h-full flex-col justify-between border-l-4 bg-white p-7 ${style.border}`}
      >
        <div>
          <div className="flex w-full items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-[0.14em] ${style.tag}`}>
              Pilar {pillar.number}
            </span>
            <span className={`font-heading text-3xl font-black transition-colors ${style.number}`}>{pillar.number}</span>
          </div>

          <div className="mt-5">
            <h3 className="font-heading text-lg font-extrabold text-primary sm:text-xl">{pillar.title}</h3>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-ink-soft">{pillar.description}</p>
          </div>
        </div>

        <span className="mt-6 h-px w-12 bg-gold" aria-hidden="true" />
      </article>
    </Reveal>
  )
}
