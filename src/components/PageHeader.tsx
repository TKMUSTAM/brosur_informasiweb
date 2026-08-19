import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { LogoEmblem } from './Logo'
import Reveal from './Reveal'

type Crumb = { label: string; href?: string }

type Props = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  crumbs?: Crumb[]
  variant?: 'green' | 'cream'
  children?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, crumbs, variant = 'green', children }: Props) {
  const isGreen = variant === 'green'
  return (
    <section className={`relative overflow-hidden ${isGreen ? 'bg-primary text-white' : 'bg-cream'}`}>
      {/* dekorasi */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-none bg-primary-light/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-none bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-10 hidden opacity-10 md:block">
        <LogoEmblem size={140} light={isGreen} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 sm:pb-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link to="/" className={isGreen ? 'text-white/75 hover:text-gold' : 'text-ink-mute hover:text-primary'}>
                  Beranda
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className={`h-3.5 w-3.5 ${isGreen ? 'text-white/40' : 'text-ink-mute'}`} />
                  {c.href ? (
                    <Link to={c.href} className={isGreen ? 'text-white/75 hover:text-gold' : 'text-ink-mute hover:text-primary'}>
                      {c.label}
                    </Link>
                  ) : (
                    <span className={`font-semibold ${isGreen ? 'text-gold' : 'text-primary'}`} aria-current="page">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal className="max-w-3xl">
          {eyebrow && (
            <span className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${isGreen ? 'bg-gold text-primary' : 'bg-softgreen text-primary'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isGreen ? 'bg-primary' : 'bg-gold-dark'}`} />
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl">{title}</h1>
          {description && <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${isGreen ? 'text-white/75' : 'text-ink-soft'}`}>{description}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  )
}
