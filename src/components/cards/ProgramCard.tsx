import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Users, CheckCircle2 } from 'lucide-react'
import Reveal from '../Reveal'
import type { Program } from '../../data/programs'

export default function ProgramCard({ program, index = 0 }: { program: Program; index?: number }) {
  return (
    <Reveal delay={index * 100} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/50 hover:shadow-lift">
        {/* Gambar Utama Program */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
          <img
            src={program.image}
            alt={program.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-extrabold text-primary shadow-soft backdrop-blur-md">
            {program.code}
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-primary/95 px-3.5 py-1 text-xs font-bold text-gold-light shadow-soft backdrop-blur-md">
            {program.age}
          </span>
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <p className="text-xs font-semibold text-gold-light/90">{program.subtitle}</p>
          </div>
        </div>

        {/* Konten Kartu */}
        <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
          <h3 className="font-heading text-xl font-extrabold text-primary transition-colors group-hover:text-primary-light sm:text-2xl">
            {program.name}
          </h3>
          <p className="text-sm leading-relaxed text-ink-soft">{program.description}</p>

          {/* 3 Highlights */}
          <ul className="mt-1 space-y-2 border-t border-primary/5 pt-3">
            {program.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-mint" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Info Jadwal & Rasio */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-y-2 border-t border-primary/5 pt-4 text-xs font-semibold text-ink-mute">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold-dark" />
              {program.schedule}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-softgreen px-2.5 py-1 text-primary">
              <Users className="h-3.5 w-3.5 text-primary-mint" />
              Rasio {program.ratio}
            </span>
          </div>

          <Link
            to={`/program/${program.slug}`}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-cream py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <span>Pelajari Kurikulum &amp; Jadwal</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
