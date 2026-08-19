import SectionHeading from '../components/SectionHeading'
import GalleryCard from '../components/cards/GalleryCard'
import { ButtonLink } from '../components/Buttons'
import Reveal from '../components/Reveal'
import { gallery } from '../data/gallery'

export default function GallerySection() {
  const preview = gallery.slice(0, 6)

  return (
    <section className="bg-gradient-to-b from-cream to-white px-4 py-20 sm:px-6 sm:py-24" aria-label="Galeri Dokumentasi">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Dokumentasi Kegiatan"
          title="Momen Ceria &amp; Prestasi Santri Al-Mustam"
          subtitle="Suasana belajar sentra, hafalan Al-Qur’an, eksplorasi sains, dan kebersamaan santri yang penuh kehangatan."
        />

        {/* Grid Galeri Rapi & Simetris (Tanpa Space Kosong) */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {preview.map((item, i) => (
            <Reveal key={item.id} delay={i * 70} className="h-full">
              <GalleryCard item={item} aspectClass="aspect-[4/3]" />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink to="/galeri" variant="primary" size="lg" withArrow className="shadow-soft">
            Lihat Semua Dokumentasi ({gallery.length}+ Foto)
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
