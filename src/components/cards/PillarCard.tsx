import Reveal from '../Reveal'
import { pillars } from '../../data/content'

const cardStyles: Record<string, { tag: string; border: string; number: string }> = {
  green: {
    tag: 'bg-softgreen text-primary',
    border: 'border-primary/10 hover:border-primary/30',
    number: 'text-primary/20 group-hover:text-primary/35',
  },
  red: {
    tag: 'bg-softred text-warmred',
    border: 'border-warmred/15 hover:border-warmred/30',
    number: 'text-warmred/20 group-hover:text-warmred/35',
  },
  gold: {
    tag: 'bg-softyellow text-gold-ink',
    border: 'border-gold/25 hover:border-gold/50',
    number: 'text-gold-dark/25 group-hover:text-gold-dark/40',
  },
  blue: {
    tag: 'bg-softblue text-secondary',
    border: 'border-secondary/15 hover:border-secondary/30',
    number: 'text-secondary/20 group-hover:text-secondary/35',
  },
}

export default function PillarCard({ index = 0 }: { index?: number }) {
  const pillar = pillars[index] ?? pillars[0]
  const style = cardStyles[pillar.color] ?? cardStyles.green

  return (
    <Reveal delay={index * 80} className="h-full">
      <article
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ring-1 ring-black/5 ${style.border}`}
      >
        <div>
          <div className="flex w-full items-center justify-between">
            <span className={`rounded-full px-3.5 py-1 text-xs font-black tracking-wide ${style.tag}`}>
              Pilar {pillar.number}
            </span>
            <span className={`font-heading text-3xl font-black transition-colors ${style.number}`}>{pillar.number}</span>
          </div>

          <div className="mt-5">
            <h3 className="font-heading text-lg font-extrabold text-primary sm:text-xl">{pillar.title}</h3>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-ink-soft">{pillar.description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="h-1.5 w-10 rounded-full bg-gold transition-all duration-300 group-hover:w-20" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
        </div>
      </article>
    </Reveal>
  )
}
