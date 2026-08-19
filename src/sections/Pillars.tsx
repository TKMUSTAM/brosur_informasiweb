import SectionHeading from '../components/SectionHeading'
import PillarCard from '../components/cards/PillarCard'
import { pillars } from '../data/content'

export default function Pillars() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-20 sm:px-6 sm:py-24" aria-label="Pilar karakter unggulan">
      <div className="dot-grid pointer-events-none absolute right-0 top-10 h-72 w-72 opacity-40" />
      <div className="dot-grid pointer-events-none absolute bottom-0 left-0 h-64 w-64 opacity-40" />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Fondasi Karakter Qur’ani"
          title="7 Pilar Keunggulan Pendidikan Karakter Al-Mustam"
          subtitle="Mengintegrasikan adab, pembiasaan ibadah, kecerdasan sensori, dan kemandirian anak dalam setiap detak kegiatan sekolah."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <div key={p.number} className={i === 6 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''}>
              <PillarCard index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
