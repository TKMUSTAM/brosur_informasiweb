import { Expand } from 'lucide-react'
import type { GalleryItem } from '../../types/cms'

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
      className={`group relative block w-full overflow-hidden rounded-2xl border border-primary/15 bg-cream text-left transition-colors duration-200 hover:border-primary/40 focus-visible:outline-3 focus-visible:outline-gold ${aspectClass}`}
      aria-label={`Lihat foto dokumentasi: ${item.title}`}
    >
      <img
        src={item.image ?? '/images/content/galeri-1.jpg'}
        alt={item.imageAlt || item.title}
        width="640"
        height="480"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
      />

      {/* Modern Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-deep/90 via-primary-deep/20 to-transparent p-5 opacity-100">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-gold-light">
              {item.category}
            </span>
            <h3 className="font-heading text-xs sm:text-sm font-extrabold leading-snug text-white">
              {item.title}
            </h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-primary-deep">
            <Expand className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}
