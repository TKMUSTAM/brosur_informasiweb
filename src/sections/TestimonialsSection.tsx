import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/cards/TestimonialCard'
import { testimonials } from '../data/content'

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24" aria-label="Testimoni">
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-none bg-softgreen blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-none bg-softyellow blur-3xl" />

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
