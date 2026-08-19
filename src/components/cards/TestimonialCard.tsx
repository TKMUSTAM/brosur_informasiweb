import { Quote, Star } from 'lucide-react'
import Reveal from '../Reveal'

type Props = {
  name: string
  status: string
  quote: string
  initials: string
  avatarColor: 'green' | 'blue' | 'red' | 'gold'
  index?: number
}

const avatarColors: Record<Props['avatarColor'], string> = {
  green: 'bg-primary text-white',
  blue: 'bg-secondary text-white',
  red: 'bg-warmred text-white',
  gold: 'bg-gold text-primary-deep',
}

export default function TestimonialCard({ name, status, quote, initials, avatarColor, index = 0 }: Props) {
  return (
    <Reveal delay={index * 110} className="h-full">
      <figure className="group relative flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold" />
            ))}
          </div>
          <Quote className="h-8 w-8 text-primary/15 transition-colors group-hover:text-gold/40" />
        </div>

        <blockquote className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
          “{quote}”
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3.5 border-t border-primary/5 pt-5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-heading text-xs font-black shadow-soft ${avatarColors[avatarColor]}`}>
            {initials}
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-sm font-extrabold text-primary">{name}</span>
            <span className="text-xs font-semibold text-ink-mute">{status}</span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}
