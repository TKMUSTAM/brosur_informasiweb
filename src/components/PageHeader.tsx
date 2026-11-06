import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogoEmblem } from './Logo'
import Reveal from './Reveal'
import { RiHome5Line, RiArrowRightSLine } from './icons/PageIcons'

type Crumb = { label: string; href?: string }

type Props = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  crumbs?: Crumb[]
  variant?: 'green' | 'cream'
  children?: ReactNode
}

export default function PageHeader({ title, description, crumbs, variant = 'green', children }: Props) {
  const isGreen = variant === 'green'

  return (
    <section className={`relative overflow-hidden ${isGreen ? 'bg-primary text-white' : 'bg-cream'}`}>
      {/* Authentic subtle emblem watermark */}
      <div className="pointer-events-none absolute right-[12%] top-10 hidden opacity-10 md:block">
        <LogoEmblem size={140} light={isGreen} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/"
                  className={`inline-flex items-center gap-1.5 ${isGreen ? 'text-white/75 hover:text-gold' : 'text-ink-mute hover:text-primary'}`}
                >
                  <RiHome5Line className="h-3.5 w-3.5" />
                  <span>Beranda</span>
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <RiArrowRightSLine className={`h-3.5 w-3.5 ${isGreen ? 'text-white/40' : 'text-ink-mute'}`} />
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
          <h1 className="text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-5xl">{title}</h1>
          {description && (
            <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg ${isGreen ? 'text-white/80' : 'text-ink-soft'}`}>
              {description}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  )
}
