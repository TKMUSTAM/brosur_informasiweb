import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowRightLine, RiExternalLinkLine } from 'react-icons/ri'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'white' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-light active:scale-[0.98]',
  gold: 'bg-gold text-primary hover:bg-gold-light active:scale-[0.98]',
  outline:
    'border border-primary/25 bg-transparent text-primary hover:border-primary hover:bg-softgreen active:scale-[0.98]',
  ghost: 'bg-transparent text-primary hover:bg-softgreen',
  white: 'bg-white text-primary hover:bg-cream active:scale-[0.98]',
  soft: 'bg-softgreen text-primary hover:bg-primary hover:text-white active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs sm:text-sm',
  md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3',
  lg: 'px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base',
}

type LinkButtonProps = {
  to: string
  variant?: Variant
  size?: Size
  children: React.ReactNode
  withArrow?: boolean
  className?: string
} & Omit<ComponentProps<typeof Link>, 'to'>

export function ButtonLink({ to, variant = 'primary', size = 'md', children, withArrow, className = '', ...rest }: LinkButtonProps) {
  const isExternal = to.startsWith('http') || to.startsWith('//')

  if (isExternal) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
        {withArrow && <RiExternalLinkLine className="h-4 w-4 shrink-0 opacity-80" />}
      </a>
    )
  }

  return (
    <Link to={to} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
      {withArrow && <RiArrowRightLine className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  )
}

type AnchorButtonProps = {
  href: string
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
} & Omit<ComponentProps<'a'>, 'href'>

export function ButtonAnchor({ href, variant = 'primary', size = 'md', children, className = '', ...rest }: AnchorButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </a>
  )
}

type ButtonProps = {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
} & ComponentProps<'button'>

export function Button({ variant = 'primary', size = 'md', children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
