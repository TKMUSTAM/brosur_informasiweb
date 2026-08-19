import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { NewsItem } from '../../data/news'

const categoryColors: Record<string, string> = {
  Pendidikan: 'bg-softgreen text-primary',
  Kajian: 'bg-softyellow text-gold-ink',
  PHBI: 'bg-softred text-warmred-dark',
  'Kegiatan Anak': 'bg-softblue text-secondary-dark',
  Sosial: 'bg-softred text-warmred-dark',
  Yatim: 'bg-primary text-white',
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/50 hover:shadow-lift">
      <Link to={`/berita/${item.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-cream" aria-label={item.title}>
        <img
          src={item.image ?? '/images/content/news-isra-miraj.jpg'}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/40 via-transparent to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-soft backdrop-blur-md ${categoryColors[item.category] ?? 'bg-softgreen text-primary'}`}>
          {item.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-mute">
          <CalendarDays className="h-3.5 w-3.5 text-gold-dark" />
          {item.date}
        </span>
        
        <h3 className="font-heading text-base font-extrabold leading-snug text-primary sm:text-lg">
          <Link to={`/berita/${item.slug}`} className="transition-colors hover:text-primary-light">
            {item.title}
          </Link>
        </h3>
        
        <p className="line-clamp-3 text-xs leading-relaxed text-ink-soft sm:text-sm">{item.excerpt}</p>
        
        <Link
          to={`/berita/${item.slug}`}
          className="mt-auto inline-flex items-center gap-2 border-t border-primary/5 pt-4 text-xs font-extrabold text-primary transition-all group-hover:gap-3"
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
