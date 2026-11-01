import type { ReactNode } from 'react'
import Reveal from './Reveal'

type Props = {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
  className = '',
}: Props) {
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  return (
    <Reveal className={`max-w-3xl flex flex-col gap-3 ${alignCls} ${className}`}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] ${
            light ? 'text-gold-light' : 'text-primary/75'
          }`}
        >
          <span className={`h-px w-8 ${light ? 'bg-gold' : 'bg-gold-dark'}`} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.55rem] lg:leading-[1.15] ${
          light ? 'text-white' : 'text-primary'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl text-pretty text-base leading-relaxed ${light ? 'text-white/75' : 'text-ink-soft'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
