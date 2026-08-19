import { Link } from 'react-router-dom'
import { site } from '../data/site'

/**
 * Logo Yayasan & TK Islam Al-Mustam — Lambang kubah Islam, buku Al-Qur'an, dan bintang cahaya.
 */
export function LogoEmblem({ size = 42, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="18" fill={light ? '#FFFFFF' : '#0F4435'} />
      {/* Ornamen Kubah & Bintang */}
      <path
        d="M32 12C24.5 12 18.5 18 18.5 25.5V30H15V44C15 46.2 16.8 48 19 48H45C47.2 48 49 46.2 49 44V30H45.5V25.5C45.5 18 39.5 12 32 12Z"
        fill={light ? '#0F4435' : '#E5B235'}
        opacity={light ? 0.95 : 1}
      />
      {/* Kitab / Rehal */}
      <path
        d="M25 35C28 33 32 34 32 34C32 34 36 33 39 35V42C36 40 32 41 32 41C32 41 28 40 25 42V35Z"
        fill={light ? '#E5B235' : '#FFFFFF'}
      />
      {/* Bintang Nur */}
      <circle cx="32" cy="22" r="3" fill={light ? '#E5B235' : '#FAF7F2'} />
    </svg>
  )
}

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${site.name} — Beranda`}>
      <span className="relative shrink-0">
        <span
          aria-hidden="true"
          className={`absolute -inset-1.5 rounded-2xl blur-md transition-opacity duration-300 group-hover:opacity-100 ${
            light ? 'bg-gold/25 opacity-30' : 'bg-gold/25 opacity-0'
          }`}
        />
        <LogoEmblem size={compact ? 36 : 42} light={light} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-heading text-base sm:text-lg font-black tracking-tight transition-colors ${
              light ? 'text-white' : 'text-primary'
            }`}
          >
            {site.shortName}
          </span>
          <span className="mt-1 flex items-center gap-1.5">
            <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-gradient-to-r from-gold to-gold-light" />
            <span className={`text-[11px] font-bold tracking-tight ${light ? 'text-white/70' : 'text-ink-mute'}`}>
              {site.tagline}
            </span>
          </span>
        </span>
      )}
    </Link>
  )
}
