import { Expand } from 'lucide-react'
import type { GalleryItem } from '../../data/gallery'

export default function GalleryCard({
  item,
  onClick,
  aspectClass = 'aspect-[4/3]',
}: {
  item: GalleryItem
  onClick?: () => void
  aspectClass?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full overflow-hidden rounded-3xl border border-primary/10 bg-cream text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift focus-visible:outline-3 focus-visible:outline-gold ${aspectClass}`}
      aria-label={`Lihat foto dokumentasi: ${item.title}`}
    >
      <img
        src={item.image ?? '/images/content/galeri-1.jpg'}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
      />

      {/* Modern Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-deep/90 via-primary-deep/30 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-gold-light">
              {item.category}
            </span>
            <h3 className="font-heading text-xs sm:text-sm font-extrabold leading-snug text-white">
              {item.title}
            </h3>
          </div>
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-gold text-primary-deep shadow-soft transition-transform duration-300 group-hover:scale-110">
            <Expand className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}
