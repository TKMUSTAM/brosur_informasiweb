import { Child, Star } from './Scene'

// ============================================================
// HERO ART — Komposisi utama hero: anak belajar Al-Qur'an,
// guru mendampingi, masjid, bulan sabit, dan bentuk geometris.
// ============================================================

export default function HeroArt({ className }: { className?: string }) {
  const green = '#124B3A'
  const greenSoft = '#BFE0D1'
  const gold = '#F4C542'
  const blue = '#3D82C6'
  const cream = '#FFF8EE'

  return (
    <svg
      viewBox="0 0 560 520"
      className={className}
      role="img"
      aria-label="Ilustrasi anak-anak belajar Al-Qur'an dengan guru di lingkungan Islami"
    >
      {/* blob organik latar */}
      <path
        d="M280 18 C410 8 548 120 552 258 C556 396 448 508 306 512 C168 516 34 424 26 292 C18 164 150 28 280 18 Z"
        fill={greenSoft}
        opacity={0.5}
      />
      <path
        d="M288 44 C400 40 520 136 524 258 C528 380 436 480 312 484 C196 488 80 406 74 292 C68 186 176 48 288 44 Z"
        fill="#DCEFE4"
      />

      {/* bentuk geometris dekoratif */}
      <circle cx={86} cy={108} r={34} fill={gold} opacity={0.9} />
      <circle cx={86} cy={108} r={52} fill="none" stroke={gold} strokeWidth={3} opacity={0.55} />
      <circle cx={492} cy={88} r={22} fill={blue} opacity={0.85} />
      <circle cx={492} cy={88} r={36} fill="none" stroke={blue} strokeWidth={3} opacity={0.4} />
      <rect x={470} y={420} width={54} height={54} rx={14} transform="rotate(14 497 447)" fill={cream} stroke={green} strokeWidth={3} />
      <polygon points="96,420 128,420 112,448" fill={green} opacity={0.25} />
      <circle cx={416} cy={60} r={8} fill={gold} />
      <circle cx={140} cy={300} r={6} fill={green} opacity={0.3} />

      <Star x={52} y={40} r={10} color={gold} />
      <Star x={470} y={190} r={9} color={gold} />
      <Star x={210} y={40} r={7} color={gold} />

      {/* bulan sabit */}
      <g transform="translate(452 36)">
        <circle r={30} fill={gold} />
        <circle cx={-13} cy={-11} r={30} fill="#F4F0E4" />
      </g>

      {/* siluet masjid */}
      <g opacity={0.28}>
        <path d="M150 470 L150 380 Q190 340 230 380 L230 470 Z" fill={green} />
        <path d="M330 470 L330 380 Q370 340 410 380 L410 470 Z" fill={green} />
        <path d="M236 388 Q280 322 324 388 Z" fill={green} />
        <circle cx={280} cy={300} r={16} fill={green} />
        <rect x="136" y="470" width="288" height="14" rx="7" fill={green} />
        <path d="M262 300 L280 258 L298 300 Z" fill={green} />
      </g>

      {/* rehal + kitab (tengah) */}
      <g transform="translate(280 330)">
        <path d="M-16 6 L16 6 L6 30 L-6 30 Z" fill={green} />
        <g transform="rotate(-5 0 -16)">
          <path d="M0 -26 Q-26 -28 -32 -18 L-32 6 Q-26 -2 0 0 Q26 -2 32 6 L32 -18 Q26 -28 0 -26 Z" fill="#FFFFFF" stroke={green} strokeWidth={2.6} />
          <path d="M0 -24 L0 0" stroke={green} strokeWidth={1.8} />
          <path d="M-16 -18 Q-10 -20 -4 -18 M-16 -12 Q-10 -14 -4 -12 M-16 -6 Q-10 -8 -4 -6 M6 -18 Q12 -20 18 -18 M6 -12 Q12 -14 18 -12 M6 -6 Q12 -8 18 -6" stroke={green} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* anak perempuan hijab membaca Al-Qur'an */}
      <Child x={280} y={392} color={green} hijab hijabColor={green} sitting scale={1.35} />

      {/* anak laki-laki membaca buku */}
      <Child x={416} y={404} color={blue} sitting scale={1.25} />
      <g transform="translate(446 372) rotate(-8)">
        <path d="M-14 4 Q0 -5 14 4 L14 11 Q0 3 -14 11 Z" fill="#FFFFFF" stroke={blue} strokeWidth={1.8} />
      </g>

      {/* guru mendampingi */}
      <Child x={168} y={384} color="#8A6BBE" scale={1.5} flip />
      {/* tangan guru menunjuk ke arah kitab */}
      <path d="M186 366 q22 -18 52 -20" stroke={green} strokeWidth={3.4} strokeLinecap="round" fill="none" />

      {/* bantal/alas */}
      <ellipse cx={280} cy={452} rx={64} ry={12} fill={green} opacity={0.16} />
      <ellipse cx={416} cy={462} rx={52} ry={10} fill={blue} opacity={0.16} />

      {/* ikon kecil mengambang */}
      <g transform="translate(64 236)">
        <path d="M0 0 Q5 12 0 26 Q-5 12 0 0 Z" fill={green} />
      </g>
      <g transform="translate(508 300)">
        <path d="M0 0 Q5 12 0 26 Q-5 12 0 0 Z" fill={blue} />
      </g>

      {/* titik-titik confetti */}
      <circle cx={170} cy={60} r={5} fill={gold} />
      <circle cx={330} cy={24} r={4} fill={blue} />
      <circle cx={386} cy={140} r={5} fill={green} opacity={0.35} />
      <circle cx={60} cy={400} r={5} fill={blue} opacity={0.5} />
      <circle cx={300} cy={470} r={5} fill={gold} opacity={0.7} />

      {/* wajah smile pada matahari */}
      <g transform="translate(86 108)">
        <circle cx={-8} cy={-4} r={2.6} fill={cream} />
        <circle cx={8} cy={-4} r={2.6} fill={cream} />
        <path d="M-7 4 Q0 11 7 4" stroke={cream} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </g>

      {/* bintang kecil */}
      <Star x={250} y={150} r={6} color={gold} />
      <g opacity={0.85}><Star x={360} y={120} r={5} color={gold} /></g>
      <Star x={180} y={180} r={4} color={green} />
    </svg>
  )
}
