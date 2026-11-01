import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/cards/TestimonialCard'
import { testimonials } from '../data/content'

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24" aria-label="Testimoni">
      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Testimoni"
          title="Cerita dari Orang Tua"
          subtitle="Kepercayaan orang tua adalah motivasi terbesar kami untuk terus memberikan yang terbaik."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
