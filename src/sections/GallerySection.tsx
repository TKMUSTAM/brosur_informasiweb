import SectionHeading from '../components/SectionHeading'
import GalleryCard from '../components/cards/GalleryCard'
import { ButtonLink } from '../components/Buttons'
import Reveal from '../components/Reveal'
import { useCMS } from '../hooks/useCMS'

export default function GallerySection() {
  const { data } = useCMS()
  const gallery = data.gallery.filter((item) => item.status !== 'DRAFT')
  if (gallery.length === 0) return null
  const preview = gallery.slice(0, 6)

  return (
    <section className="border-y border-primary/10 bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Galeri Dokumentasi">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Dokumentasi Kegiatan"
          title="Momen Ceria &amp; Prestasi Santri Al-Mustam"
          subtitle="Suasana belajar sentra, hafalan Al-Qur’an, eksplorasi sains, dan kebersamaan santri yang penuh kehangatan."
        />

        {/* Grid Galeri Rapi & Simetris (Tanpa Space Kosong) */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item, i) => (
            <Reveal key={item.id} delay={i * 70} className="h-full">
              <GalleryCard item={item} aspectClass="aspect-[4/3]" />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink to="/galeri" variant="primary" size="lg" withArrow className="shadow-soft">
            Lihat Semua Dokumentasi ({gallery.length} Foto)
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
