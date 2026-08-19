import Icon from '../Icon'
import Reveal from '../Reveal'
import { pillars } from '../../data/content'

const cardStyles: Record<string, { bg: string; icon: string; border: string; number: string }> = {
  green: {
    bg: 'bg-softgreen/40 hover:bg-softgreen/80',
    icon: 'bg-primary text-gold-light',
    border: 'border-primary/10 hover:border-primary/30',
    number: 'text-primary/15',
  },
  red: {
    bg: 'bg-softred/40 hover:bg-softred/80',
    icon: 'bg-warmred text-white',
    border: 'border-warmred/15 hover:border-warmred/30',
    number: 'text-warmred/15',
  },
  gold: {
    bg: 'bg-softyellow/40 hover:bg-softyellow/80',
    icon: 'bg-gold text-primary-deep',
    border: 'border-gold/25 hover:border-gold/50',
    number: 'text-gold-dark/20',
  },
  blue: {
    bg: 'bg-softblue/40 hover:bg-softblue/80',
    icon: 'bg-secondary text-white',
    border: 'border-secondary/15 hover:border-secondary/30',
    number: 'text-secondary/15',
  },
}

export default function PillarCard({ index = 0 }: { index?: number }) {
  const pillar = pillars[index] ?? pillars[0]
  const style = cardStyles[pillar.color] ?? cardStyles.green

  return (
    <Reveal delay={index * 80} className="h-full">
      <article
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lift ${style.border}`}
      >
        <div>
          <div className="flex w-full items-start justify-between">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${style.icon}`}
            >
              <Icon name={pillar.icon} className="h-7 w-7" />
            </span>
            <span className={`font-heading text-4xl font-black ${style.number}`}>{pillar.number}</span>
          </div>

          <div className="mt-5">
            <h3 className="font-heading text-lg font-extrabold text-primary sm:text-xl">{pillar.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{pillar.description}</p>
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
