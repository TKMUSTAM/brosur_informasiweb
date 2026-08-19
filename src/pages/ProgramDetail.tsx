import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, Users, CalendarDays } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ContentImage from '../components/illustrations/ContentImage'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { programs } from '../data/programs'
import { iconToScene } from '../lib/scenes'

export default function ProgramDetail() {
  const { slug } = useParams()
  const program = programs.find((p) => p.slug === slug)

  useSEO({
    title: program ? (program.code === program.name ? program.code : `${program.code} — ${program.name}`) : 'Program',
    description: program?.description ?? 'Program pendidikan Yayasan Mustam.',
    path: `/program/${slug}`,
  })

  if (!program) return <Navigate to="/program" replace />

  return (
    <>
      <PageHeader
        eyebrow={program.code}
        title={program.name}
        description={program.description}
        crumbs={[{ label: 'Program Pendidikan', href: '/program' }, { label: program.code }]}
        variant="green"
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <Users className="h-4 w-4 text-gold" /> {program.ageRange}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4 text-gold" /> {program.schedule}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <CalendarDays className="h-4 w-4 text-gold" /> {program.capacity}
          </span>
        </div>
      </PageHeader>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* visual */}
            <Reveal className="lg:sticky lg:top-28">
              <div className="blob-shape overflow-hidden shadow-lift">
                <ContentImage
                  image={program.image}
                  scene={iconToScene(program.icon)}
                  palette={program.color}
                  alt={program.name}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>

            {/* konten */}
            <div>
              <Reveal>
                <h2 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                  Yang Dipelajari di {program.code}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{program.description}</p>
              </Reveal>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {program.highlights.map((h, i) => (
                  <Reveal as="li" key={h} delay={i * 50} className="flex items-start gap-3 rounded-xl border border-primary/5 bg-white px-4 py-3.5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-lift">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-semibold text-ink">{h}</span>
                  </Reveal>
                ))}
              </ul>

              {/* info singkat */}
              <Reveal className="mt-8 grid gap-4 rounded-card bg-softgreen p-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Usia</p>
                  <p className="mt-1 font-heading text-base font-extrabold text-primary">{program.age}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Kapasitas</p>
                  <p className="mt-1 font-heading text-base font-extrabold text-primary">{program.capacity}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Rasio Guru</p>
                  <p className="mt-1 font-heading text-base font-extrabold text-primary">{program.ratio}</p>
                </div>
              </Reveal>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/ppdb/daftar" variant="primary" size="lg" withArrow>
                  Daftar {program.code}
                </ButtonLink>
                <Link
                  to="/program"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-ink-soft transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" /> Semua Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={<>Siap Bergabung di {program.code}?</>}
        description="Kuota terbatas setiap tahun ajaran. Amankan kursi buah hati Anda sekarang."
        primaryLabel={`Daftar ${program.code}`}
      />
    </>
  )
}
