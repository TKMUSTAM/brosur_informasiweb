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
  align = 'center',
  light = false,
  className = '',
}: Props) {
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  return (
    <Reveal className={`max-w-2xl flex flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && (
        <p
          className={`text-xs sm:text-sm font-black uppercase tracking-[0.2em] ${
            light ? 'text-gold-light' : 'text-primary/75'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] ${
          light ? 'text-white' : 'text-primary'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base leading-relaxed sm:text-lg ${light ? 'text-white/75' : 'text-ink-soft'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
