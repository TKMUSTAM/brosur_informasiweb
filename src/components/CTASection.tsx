import Reveal from './Reveal'
import { ButtonLink } from './Buttons'
import { LogoEmblem } from './Logo'

type Props = {
  title: React.ReactNode
  description?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

export default function CTASection({
  title,
  description,
  primaryLabel = 'Daftar Sekarang',
  primaryTo = '/ppdb/daftar',
  secondaryLabel = 'Menjadi Donatur',
  secondaryTo = '/yatim/donasi',
}: Props) {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 sm:px-6 sm:py-28">
      {/* dekorasi */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-none bg-primary-light/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-none bg-gold/15 blur-3xl" />
      <div className="blob-shape pointer-events-none absolute right-[8%] top-10 hidden h-40 w-40 bg-white/5 md:block" />
      <div className="pointer-events-none absolute left-[6%] top-16 hidden opacity-[0.07] md:block">
        <LogoEmblem size={160} light />
      </div>

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-gold-light">
          Bergabung Bersama Kami
        </span>
        <h2 className="text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl lg:text-5xl">{title}</h2>
        {description && <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={primaryTo} variant="gold" size="lg">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink
            to={secondaryTo}
            variant="white"
            size="lg"
            className="border-2 border-transparent bg-white/10 text-white hover:bg-white/20"
          >
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
