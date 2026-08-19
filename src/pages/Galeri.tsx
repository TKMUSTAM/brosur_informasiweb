import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GalleryCard from '../components/cards/GalleryCard'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { galleryCategories, type GalleryItem } from '../data/gallery'

export default function Galeri() {
  const { data } = useCMS()
  const site = data.site
  const gallery = data.gallery

  useSEO({
    title: `Galeri Foto Dokumentasi — ${site.name}`,
    description: `Galeri dokumentasi kegiatan pembelajaran, murojaah tahfidz, praktik ibadah, dan outing santri di ${site.name}.`,
    path: '/galeri',
  })

  const [category, setCategory] = useState('Semua')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const lightboxRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const filtered = useMemo(
    () => (category === 'Semua' ? gallery : gallery.filter((g) => g.category === category)),
    [category, gallery],
  )

  const openLightbox = (item: GalleryItem) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    setSelected(item)
  }

  const closeLightbox = () => {
    setSelected(null)
    lastFocusedRef.current?.focus()
  }

  // Keyboard navigation & focus trap untuk lightbox
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
        return
      }
      if (e.key === 'ArrowRight') {
        setSelected((prev) => {
          const idx = filtered.findIndex((g) => g.id === prev?.id)
          return filtered[(idx + 1) % filtered.length]
        })
      }
      if (e.key === 'ArrowLeft') {
        setSelected((prev) => {
          const idx = filtered.findIndex((g) => g.id === prev?.id)
          return filtered[(idx - 1 + filtered.length) % filtered.length]
        })
      }
      if (e.key === 'Tab') {
        const el = lightboxRef.current
        if (!el) return
        const focusables = el.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      lightboxRef.current?.querySelector<HTMLElement>('button')?.focus()
    }, 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      window.clearTimeout(t)
    }
  }, [selected, filtered])

  return (
    <>
      <PageHeader
        eyebrow="Galeri Dokumentasi"
        title="Momen Ceria &amp; Tumbuh Kembang Santri"
        description="Dokumentasi autentik aktivitas pembelajaran 5 sentra, murojaah Al-Qur’an, peringatan hari besar Islam, dan kreativitas santri."
        crumbs={[{ label: 'Galeri Foto' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          
          {/* Filter Kategori Berjejer Rapi */}
          <Reveal className="flex justify-center">
            <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto rounded-full border border-primary/10 bg-white p-1.5 shadow-soft">
              {galleryCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all ${
                    category === c
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-ink-soft hover:bg-softgreen hover:text-primary'
                  }`}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <h2 className="sr-only">Koleksi Galeri Foto</h2>

          {/* Grid Galeri Simetris & Presisi (Tanpa Celah/Space Kosong) */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
            {filtered.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60} className="h-full">
                <GalleryCard
                  item={item}
                  onClick={() => openLightbox(item)}
                  aspectClass="aspect-[4/3]"
                />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 rounded-3xl border border-primary/10 bg-cream p-12 text-center text-ink-mute">
              <ImageIcon className="mx-auto h-12 w-12 text-primary/30" />
              <p className="mt-3 font-heading text-lg font-bold text-primary">Belum ada foto dalam kategori ini</p>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Pop-up Layar Penuh */}
      {selected && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-primary-deep/95 p-4 sm:p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors hover:bg-gold hover:text-primary-deep"
            aria-label="Tutup pratinjau foto"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-black/40 shadow-2xl">
              <img
                src={selected.image ?? '/images/content/galeri-1.jpg'}
                alt={selected.title}
                className="max-h-[75vh] w-full object-contain mx-auto"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
              <div>
                <span className="rounded-full bg-gold px-3 py-0.5 text-[10px] font-black text-primary-deep uppercase tracking-wider">
                  {selected.category}
                </span>
                <h3 className="mt-1.5 font-heading text-base sm:text-lg font-extrabold text-white">
                  {selected.title}
                </h3>
              </div>
              <p className="text-xs text-white/60">Gunakan panah keyboard (← →) atau tekan Esc untuk menutup</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
