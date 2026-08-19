import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'white' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 will-change-transform active:scale-[0.97]'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-light hover:-translate-y-0.5 shadow-soft hover:shadow-lift',
  gold: 'bg-gold text-primary hover:bg-gold-light hover:-translate-y-0.5 shadow-gold',
  outline:
    'border-2 border-primary/25 bg-transparent text-primary hover:border-primary hover:bg-softgreen hover:-translate-y-0.5',
  ghost: 'bg-transparent text-primary hover:bg-softgreen',
  white: 'bg-white text-primary hover:bg-cream hover:-translate-y-0.5 shadow-soft',
  soft: 'bg-softgreen text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm sm:text-base',
  lg: 'px-7 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg',
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
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />}
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

type NativeButtonProps = {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
} & ComponentProps<'button'>

export function Button({ variant = 'primary', size = 'md', children, className = '', type = 'button', ...rest }: NativeButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
