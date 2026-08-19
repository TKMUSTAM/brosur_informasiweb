import SectionHeading from '../components/SectionHeading'
import ProgramCard from '../components/cards/ProgramCard'
import { ButtonLink } from '../components/Buttons'
import { programs } from '../data/programs'

export default function ProgramsSection() {
  return (
    <section className="bg-gradient-to-b from-white to-cream px-4 py-20 sm:px-6 sm:py-24" aria-label="Program pendidikan">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Program Pendidikan"
          title="Temukan Program Belajar yang Sesuai untuk Buah Hati"
          subtitle="Program pendidikan dirancang untuk mengembangkan kemampuan anak sekaligus membangun karakter Islami."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {programs.map((p, i) => (
            <ProgramCard key={p.slug} program={p} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink to="/program" variant="soft" size="lg" withArrow>
            Lihat Semua Program
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
