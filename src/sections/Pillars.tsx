import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { useCMS } from '../hooks/useCMS'

export default function Pillars() {
  const { data } = useCMS()

  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Pilar karakter">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Pendekatan Pendidikan"
            title="Pembiasaan karakter yang hadir dalam kegiatan harian"
            subtitle="Pilar digunakan sebagai panduan guru saat merancang aktivitas, berkomunikasi dengan anak, dan bekerja sama dengan orang tua."
          />

          <ol className="grid gap-x-10 sm:grid-cols-2">
            {data.pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.number} delay={index * 45} className="border-t border-primary/15 py-5">
                <div className="flex gap-4">
                  <span className="font-heading text-sm font-extrabold text-gold-dark">{pillar.number}</span>
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-primary">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{pillar.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
