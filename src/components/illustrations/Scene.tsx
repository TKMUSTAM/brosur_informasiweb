// ============================================================
// SCENE — Ilustrasi flat modern untuk kartu program, berita,
// galeri, dan konten. 100% offline, tanpa foto anak asli.
// ============================================================

import { PALETTES, SKIN, SKIN_SHADE, type SceneName, type PaletteKey } from './theme'

export type { SceneName, PaletteKey }

type ChildProps = {
  x: number
  y: number
  color: string
  hijab?: boolean
  hijabColor?: string
  hair?: string
  scale?: number
  flip?: boolean
  sitting?: boolean
  handsUp?: boolean
}

/** Figur anak sederhana: kepala + badan bulat + (opsional) hijab */
export function Child({
  x,
  y,
  color,
  hijab = false,
  hijabColor,
  hair = '#4A2E1B',
  scale = 1,
  flip = false,
  sitting = false,
  handsUp = false,
}: ChildProps) {
  const s = scale
  const gx = flip ? -1 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * gx} ${s}) ${flip ? 'scale(-1 1)' : ''}`}>
      {/* badan */}
      {sitting ? (
        <>
          <ellipse cx={0} cy={14} rx={12} ry={9} fill={color} />
          <path d={`M-9 12 Q0 26 9 12 Q0 17 -9 12`} fill={color} />
        </>
      ) : (
        <rect x={-10} y={6} width={20} height={20} rx={9} fill={color} />
      )}
      {/* lengan */}
      {handsUp ? (
        <>
          <path d="M-9 10 Q-16 4 -14 -2" stroke={color} strokeWidth={4.5} strokeLinecap="round" fill="none" />
          <path d="M9 10 Q16 4 14 -2" stroke={color} strokeWidth={4.5} strokeLinecap="round" fill="none" />
        </>
      ) : sitting ? (
        <>
          <circle cx={-11} cy={10} r={3.4} fill={color} />
          <circle cx={11} cy={10} r={3.4} fill={color} />
        </>
      ) : (
        <></>
      )}
      {/* kepala */}
      <circle cx={0} cy={-6} r={9.5} fill={SKIN} />
      {hijab ? (
        <>
          <path d={`M-9.5 -7 A9.5 9.5 0 0 1 9.5 -7 Q12 -1 9.5 4 Q0 7 -9.5 4 Q-12 -1 -9.5 -7 Z`} fill={hijabColor ?? color} />
          <path d={`M-9.5 -7 A9.5 9.5 0 0 1 9.5 -7`} stroke={hijabColor ?? color} strokeWidth={2.4} fill="none" />
          {/* wajah */}
          <circle cx={-3.4} cy={-5.5} r={1.15} fill="#2A1A0E" />
          <circle cx={3.4} cy={-5.5} r={1.15} fill="#2A1A0E" />
          <path d="M-2 -2 Q0 0.4 2 -2" stroke="#C0544E" strokeWidth={1.1} fill="none" strokeLinecap="round" />
          <circle cx={6.6} cy={-2.6} r={1.3} fill="#E86B6B" />
        </>
      ) : (
        <>
          <path d={`M-9.5 -9 A9.5 9.5 0 0 1 9.5 -9 Q6 -14 0 -14 Q-6 -14 -9.5 -9 Z`} fill={hair} />
          <circle cx={-3.4} cy={-5.5} r={1.15} fill="#2A1A0E" />
          <circle cx={3.4} cy={-5.5} r={1.15} fill="#2A1A0E" />
          <path d="M-2 -2 Q0 0.4 2 -2" stroke="#C0544E" strokeWidth={1.1} fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  )
}

/** Bintang dekoratif */
export function Star({ x, y, r = 5, color = '#F4C542' }: { x: number; y: number; r?: number; color?: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    return `${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`
  }).join(' ')
  return <polygon points={points} fill={color} />
}

type SceneProps = {
  scene: SceneName
  palette?: PaletteKey
  className?: string
  decorative?: boolean
}

export default function Scene({ scene, palette = 'green', className }: SceneProps) {
  const c = PALETTES[palette]
  return (
    <svg viewBox="0 0 220 170" className={className} role="img" aria-label="Ilustrasi kegiatan anak" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="170" fill={c.bg} />
      {/* dekorasi latar */}
      <circle cx={200} cy={22} r={30} fill={c.soft} opacity={0.55} />
      <circle cx={18} cy={150} r={26} fill={c.soft} opacity={0.5} />
      <Star x={32} y={26} r={6} />
      <Star x={178} y={120} r={5} color={c.accent} />
      <circle cx={208} cy={86} r={4} fill={c.accent} opacity={0.8} />

      {scene === 'quran' && (
        <g>
          {/* rehal */}
          <path d="M95 78 L125 78 L110 104 Z" fill={c.main} opacity={0.9} />
          {/* kitab terbuka */}
          <g transform="rotate(-4 110 64)">
            <path d="M110 52 Q84 50 78 60 L78 84 Q84 76 110 78 Q136 76 142 84 L142 60 Q136 50 110 52 Z" fill="#FFFFFF" stroke={c.main} strokeWidth={2.4} />
            <path d="M110 54 L110 78" stroke={c.main} strokeWidth={1.6} />
            <path d="M92 62 Q98 60 104 62 M92 68 Q98 66 104 68 M116 62 Q122 60 128 62 M116 68 Q122 66 128 68" stroke={c.main} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          </g>
          <Child x={110} y={128} color={c.main} hijab hijabColor={c.main} sitting scale={1.05} />
          <Star x={64} y={40} r={6} color={c.accent} />
          <Star x={160} y={52} r={7} color={c.accent} />
          <circle cx={152} cy={110} r={3.4} fill={c.accent} />
        </g>
      )}

      {scene === 'read' && (
        <g>
          <circle cx={70} cy={62} r={34} fill="#FFFFFF" opacity={0.8} />
          <g transform="translate(70 68) rotate(-6)">
            <path d="M-22 6 Q0 -4 22 6 L22 16 Q0 8 -22 16 Z" fill="#FFFFFF" stroke={c.main} strokeWidth={2} />
            <path d="M0 4 L0 12" stroke={c.main} strokeWidth={1.4} />
            <path d="M-14 8 Q-8 6 -4 8 M-14 12 Q-8 10 -4 12 M6 8 Q12 6 16 8 M6 12 Q12 10 16 12" stroke={c.main} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          </g>
          <Child x={110} y={118} color={c.main} hijab hijabColor={c.main} sitting scale={1.1} />
          <Star x={172} y={30} r={6} color={c.accent} />
          <circle cx={40} cy={112} r={4} fill={c.accent} />
        </g>
      )}

      {scene === 'blocks' && (
        <g>
          <rect x={70} y={104} width={26} height={26} rx={5} fill={c.main} />
          <rect x={100} y={104} width={26} height={26} rx={5} fill={c.accent} />
          <rect x={82} y={76} width={26} height={26} rx={5} fill={c.soft} stroke={c.main} strokeWidth={2} />
          <rect x={112} y={76} width={26} height={26} rx={5} fill="#FFFFFF" stroke={c.main} strokeWidth={2} />
          <circle cx={95} cy={89} r={4} fill={c.main} opacity={0.85} />
          <path d="M125 80 l4 4 l-4 4 l-4 -4 Z" fill={c.accent} />
          <Child x={170} y={118} color={c.main} scale={1} flip />
          <Star x={46} y={44} r={6} color={c.accent} />
        </g>
      )}

      {scene === 'mosque' && (
        <g>
          <path d="M46 140 L46 96 Q64 78 82 96 L82 140 Z" fill={c.main} />
          <path d="M138 140 L138 96 Q156 78 174 96 L174 140 Z" fill={c.main} />
          <path d="M92 96 Q110 70 128 96 Z" fill={c.main} />
          <rect x="36" y="140" width="148" height="8" rx="4" fill={c.main} />
          <circle cx="110" cy="52" r="9" fill={c.accent} />
          <path d="M110 40 L110 30" stroke={c.accent} strokeWidth={3} strokeLinecap="round" />
          <path d="M84 110 q6 -6 12 0 M118 110 q6 -6 12 0" stroke={c.accent} strokeWidth={2.4} fill="none" />
          <Star x={30} y={34} r={6} color={c.accent} />
          <Star x={188} y={58} r={7} color={c.accent} />
          <Child x={56} y={122} color={c.main} scale={0.92} hijab hijabColor={c.main} />
        </g>
      )}

      {scene === 'nature' && (
        <g>
          <circle cx={182} cy={34} r={14} fill={c.accent} />
          <path d="M30 150 Q70 110 100 150 Q140 96 190 150 Z" fill={c.soft} />
          <path d="M70 150 Q80 118 92 150 Z" fill={c.main} />
          <path d="M104 150 Q114 126 126 150 Z" fill={c.main} opacity={0.85} />
          <path d="M136 150 Q146 122 158 150 Z" fill={c.main} opacity={0.7} />
          <circle cx={40} cy={40} r={16} fill="#FFFFFF" opacity={0.9} />
          <Child x={70} y={104} color={c.main} scale={1.02} />
          <g transform="translate(128 100)">
            <path d="M0 0 Q4 8 0 18 Q-4 8 0 0 Z" fill={c.main} />
          </g>
          <circle cx={182} cy={118} r={4} fill={c.accent} />
        </g>
      )}

      {scene === 'pray' && (
        <g>
          <path d="M40 140 Q40 96 78 96 L142 96 Q180 96 180 140 Z" fill={c.soft} />
          <path d="M110 92 L110 30" stroke={c.accent} strokeWidth={4} strokeLinecap="round" />
          <path d="M110 22 L110 12" stroke={c.accent} strokeWidth={5} strokeLinecap="round" />
          <Child x={110} y={128} color={c.main} hijab hijabColor={c.main} sitting scale={1.1} handsUp />
          <Star x={52} y={36} r={6} color={c.accent} />
          <Star x={164} y={48} r={5} color={c.accent} />
        </g>
      )}

      {scene === 'share' && (
        <g>
          <circle cx={110} cy={80} r={38} fill="#FFFFFF" opacity={0.75} />
          <path d="M110 52 q18 20 0 40 q-18 -20 0 -40" fill={c.main} />
          <path d="M110 54 q10 12 0 26" fill="#FFFFFF" opacity={0.4} />
          <Child x={64} y={116} color={c.main} hijab hijabColor={c.main} scale={0.95} />
          <Child x={150} y={116} color={c.accent === '#124B3A' ? '#B98A1D' : c.accent} scale={0.95} flip />
          <Star x={30} y={36} r={6} color={c.accent} />
          <Star x={186} y={62} r={5} color={c.accent} />
        </g>
      )}

      {scene === 'paint' && (
        <g>
          <rect x={52} y={92} width={34} height={44} rx={6} fill={c.main} />
          <rect x={56} y={96} width={26} height={36} rx={3} fill="#FFFFFF" />
          <circle cx={62} cy={106} r={5} fill={c.accent} />
          <circle cx={74} cy={118} r={5} fill={c.alt} />
          <circle cx={94} cy={128} r={4} fill={c.accent} />
          <circle cx={70} cy={138} r={4} fill="#C94C4C" />
          <circle cx={86} cy={142} r={3} fill="#3D82C6" />
          <Child x={140} y={116} color={c.main} scale={1.02} />
          <Star x={40} y={40} r={6} color={c.accent} />
        </g>
      )}

      {scene === 'books' && (
        <g>
          <path d="M44 140 L44 60 L176 60 L176 140 Z" fill="#FFFFFF" opacity={0.85} />
          <rect x={56} y={66} width={14} height={70} rx={3} fill={c.main} />
          <rect x={76} y={58} width={14} height={78} rx={3} fill={c.accent} />
          <rect x={96} y={66} width={14} height={70} rx={3} fill={c.soft} />
          <rect x={148} y={58} width={14} height={78} rx={3} fill="#C94C4C" />
          <rect x={168} y={66} width={14} height={70} rx={3} fill="#3D82C6" />
          <Child x={62} y={118} color={c.main} sitting scale={0.9} hijab hijabColor={c.main} />
          <g transform="translate(108 116) rotate(-8)">
            <path d="M-16 4 Q0 -6 16 4 L16 12 Q0 4 -16 12 Z" fill="#FFFFFF" stroke={c.main} strokeWidth={1.8} />
          </g>
          <Star x={34} y={32} r={5} color={c.accent} />
        </g>
      )}

      {scene === 'hands' && (
        <g>
          <circle cx={110} cy={86} r={42} fill="#FFFFFF" opacity={0.8} />
          <path d="M110 30 Q96 52 104 78 Q110 92 116 78 Q124 52 110 30 Z" fill={SKIN} />
          <path d="M110 30 Q96 52 104 78 Q110 92 116 78 Q124 52 110 30 Z" fill="none" stroke={c.main} strokeWidth={2.4} />
          <path d="M96 60 Q92 66 92 74 Q94 82 104 82 M124 60 Q128 66 128 74 Q126 82 116 82" stroke={SKIN_SHADE} strokeWidth={3} strokeLinecap="round" fill="none" />
          <circle cx={110} cy={24} r={7} fill={c.accent} />
          <Star x={54} y={40} r={6} color={c.accent} />
          <Star x={166} y={48} r={6} color={c.accent} />
          <circle cx={40} cy={104} r={4} fill={c.accent} />
          <circle cx={180} cy={112} r={4} fill={c.accent} />
        </g>
      )}

      {scene === 'play' && (
        <g>
          <circle cx={110} cy={76} r={26} fill="#FFFFFF" opacity={0.85} />
          <circle cx={110} cy={76} r={26} fill="none" stroke={c.main} strokeWidth={2.2} strokeDasharray="8 6" />
          <Child x={70} y={112} color={c.main} scale={1} />
          <Child x={150} y={112} color={c.accent === '#124B3A' ? '#B98A1D' : c.accent} scale={1} flip />
          <Star x={36} y={36} r={6} color={c.accent} />
          <Star x={182} y={30} r={5} color={c.accent} />
        </g>
      )}

      {scene === 'teacher' && (
        <g>
          <Child x={164} y={104} color={c.accent === '#124B3A' ? '#B98A1D' : c.accent} scale={1.18} flip hijab hijabColor={c.accent === '#124B3A' ? '#B98A1D' : c.accent} />
          <Child x={96} y={122} color={c.main} sitting scale={1} hijab hijabColor={c.main} />
          <g transform="translate(118 92) rotate(-10)">
            <path d="M-14 4 Q0 -6 14 4 L14 11 Q0 3 -14 11 Z" fill="#FFFFFF" stroke={c.main} strokeWidth={1.8} />
          </g>
          <path d="M150 92 q10 -6 18 -2" stroke={c.main} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Star x={40} y={38} r={6} color={c.accent} />
          <Star x={176} y={30} r={5} color={c.accent} />
        </g>
      )}

      {scene === 'math' && (
        <g>
          <rect x={48} y={112} width={30} height={30} rx={6} fill={c.main} />
          <text x={63} y={133} textAnchor="middle" fontSize="16" fontWeight="800" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif">1</text>
          <rect x={86} y={112} width={30} height={30} rx={6} fill={c.accent} />
          <text x={101} y={133} textAnchor="middle" fontSize="16" fontWeight="800" fill={c.ink} fontFamily="Plus Jakarta Sans, sans-serif">+</text>
          <rect x={124} y={112} width={30} height={30} rx={6} fill={c.soft} stroke={c.main} strokeWidth={2} />
          <text x={139} y={133} textAnchor="middle" fontSize="16" fontWeight="800" fill={c.main} fontFamily="Plus Jakarta Sans, sans-serif">2</text>
          <text x={162} y={133} textAnchor="middle" fontSize="16" fontWeight="800" fill={c.ink} fontFamily="Plus Jakarta Sans, sans-serif">=</text>
          <circle cx={184} cy={127} r={15} fill={c.main} />
          <text x={184} y={132} textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif">3</text>
          <Child x={58} y={74} color={c.main} scale={0.9} hijab hijabColor={c.main} />
          <Star x={164} y={34} r={6} color={c.accent} />
        </g>
      )}
    </svg>
  )
}
