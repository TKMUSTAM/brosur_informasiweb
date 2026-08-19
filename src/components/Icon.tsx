import type { ReactNode } from 'react'

/**
 * Set ikon custom bergaya Noun Project — flat, minimal, monokrom,
 * geometris. Menggantikan ikon generik agar identitas visual lebih
 * profesional dan tidak terkesan template AI.
 *
 * SVG induk mewariskan stroke/fill ke semua path. Titik warna kecil
 * memakai fill="currentColor" stroke="none" untuk aksen solid.
 */
type IconDef = () => ReactNode

const paths: Record<string, IconDef> = {
  // ===== Mushaf / Al-Qur'an =====
  quran: () => (
    <>
      <path d="M12 3.5v12" />
      <path d="M3.5 6c2.8-1.4 5.6-2 8.5-2s5.7.6 8.5 2v12c-2.8-1.4-5.6-2-8.5-2s-5.7.6-8.5 2z" />
      <path d="M8.5 21l3.5-2.2L15.5 21" />
      <path d="M6.5 21h11" />
    </>
  ),
  read: () => (
    <>
      <path d="M12 5v14" />
      <path d="M4 6.5c2.5-1.2 5-1.7 8-1.7s5.5.5 8 1.7v13c-2.5-1.2-5-1.7-8-1.7s-5.5.5-8 1.7z" />
      <path d="M7.5 9.5h2M14.5 9.5h2" />
    </>
  ),
  // ===== Mainan edukatif / motorik =====
  blocks: () => (
    <>
      <rect x="3" y="14" width="8" height="7" />
      <rect x="8" y="8" width="8" height="7" />
      <rect x="13" y="3" width="8" height="7" />
    </>
  ),
  // ===== Masjid =====
  mosque: () => (
    <>
      <path d="M5 16c0-4.4 3.1-8 7-8s7 3.6 7 8" />
      <path d="M4 16v-2.5M20 16v-2.5" />
      <path d="M2.5 20.5h19" />
      <path d="M12 8V6" />
      <path d="M12 4.5l.8 1.6 1.8.6-1.8.6-.8 1.6-.8-1.6-1.8-.6 1.8-.6z" />
      <path d="M9.5 16.5a2.5 2.5 0 0 1 5 0" />
    </>
  ),
  // ===== Alam =====
  leaf: () => (
    <>
      <path d="M19.5 4.5C10.5 4.5 5.5 9 5.5 15.5c0 2.8 2.2 5 5 5 6.5 0 9-9.5 9-16z" />
      <path d="M6.5 18.5C11 13.5 14.5 9.5 18.5 5.5" />
    </>
  ),
  // ===== Doa / tangan =====
  pray: () => (
    <>
      <path d="M12 12.5V8a3 3 0 0 1 6 0v5c0 4-2.5 6.5-6 6.5S6 17 6 13V8a3 3 0 0 1 6 0v4.5" />
      <path d="M4.5 12.5h3M16.5 12.5h3" />
    </>
  ),
  hands: () => (
    <>
      <path d="M12 20c-4.2-2.9-6.3-5.1-6.3-8A3.7 3.7 0 0 1 12 9.4a3.7 3.7 0 0 1 6.3 2.6c0 2.9-2.1 5.1-6.3 8z" />
      <path d="M3.5 21c.4-2.4 1.8-3.9 4-4.6M20.5 21c-.4-2.4-1.8-3.9-4-4.6" />
    </>
  ),
  // ===== Berbagi / membantu =====
  share: () => (
    <>
      <path d="M12 19.5c-3.8-2.6-5.5-4.6-5.5-7A2.5 2.5 0 0 1 12 10a2.5 2.5 0 0 1 5.5 2c0 2.4-1.7 4.4-5.5 7z" />
      <path d="M3.5 21c.6-2.6 2.2-4.2 4.5-5M20.5 21c-.6-2.6-2.2-4.2-4.5-5" />
    </>
  ),
  // ===== Seni =====
  palette: () => (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="8.5" cy="11" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  // ===== Buku =====
  books: () => (
    <>
      <path d="M5 5h14v3.5H5zM7 9.5h12V13H7zM9 14h10v3.5H9z" />
    </>
  ),
  book: () => (
    <>
      <path d="M5 4.5h14v15H5z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </>
  ),
  // ===== Belajar / akademik =====
  play: () => <path d="M12 4.5l1.9 5.1 5.1 1.9-5.1 1.9L12 18.5l-1.9-5.1-5.1-1.9 5.1-1.9z" />,
  graduation: () => (
    <>
      <path d="M2.5 10.5L12 5.5l9.5 5L12 15.5z" />
      <path d="M6 12.5v4.5c0 1.7 2.7 3.2 6 3.2s6-1.5 6-3.2v-4.5" />
      <path d="M21.5 10.5V15" />
    </>
  ),
  calculator: () => (
    <>
      <rect x="5.5" y="3" width="13" height="18" />
      <path d="M8.5 7h7" />
      <path d="M8.5 11.5h1M12 11.5h1M15.5 11.5h1M8.5 15h1M12 15h1M15.5 15h1M8.5 18.5h1M12 18.5h1M15.5 18.5h1" />
    </>
  ),
  pencil: () => (
    <>
      <path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19z" />
      <path d="M14 7l3 3" />
    </>
  ),
  // ===== Nilai / simbol =====
  heart: () => (
    <path d="M12 20c-4.2-2.9-6.3-5.1-6.3-8A3.7 3.7 0 0 1 12 9.4a3.7 3.7 0 0 1 6.3 2.6c0 2.9-2.1 5.1-6.3 8z" />
  ),
  star: () => (
    <path d="M12 4l1.9 5.3 5.6.5-4.3 3.7 1.3 5.5L12 16l-4.5 3 1.3-5.5-4.3-3.7 5.6-.5z" />
  ),
  sparkles: () => (
    <>
      <path d="M12 5l1.7 4.8 4.8 1.7-4.8 1.7L12 18l-1.7-4.8-4.8-1.7 4.8-1.7z" />
      <path d="M18.5 3.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  bulb: () => (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </>
  ),
  // ===== Prestasi / fasilitas =====
  award: () => (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5L7 21l5-2.4L17 21l-1.5-7.5" />
      <path d="M12 6.5l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1.1-1.9 1.1.5-2L9 8.6l2.1-.2z" />
    </>
  ),
  utensils: () => (
    <>
      <path d="M6 3v7.5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 3v18" />
      <path d="M17 3v18" />
      <path d="M17 3c2.5 0 4 2 4 4.5S19.5 11 17 11" />
    </>
  ),
  building: () => (
    <>
      <path d="M3 21h18M5 21V9l7-5 7 5v12" />
      <path d="M10 21v-6h4v6" />
      <path d="M9 12h1M12 12h1M15 12h1M9 15h1M12 15h1M15 15h1" />
    </>
  ),
  users: () => (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M15.5 14.5c2.4.4 5 2.2 5 5.5" />
    </>
  ),
  message: () => (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8 11h6M8 14h4" />
    </>
  ),
  // ===== Keuangan / administrasi =====
  file: () => (
    <>
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M15 3v5h5" />
    </>
  ),
  wallet: () => (
    <>
      <path d="M3.5 8a2 2 0 0 1 2-2h13v12h-13a2 2 0 0 1-2-2z" />
      <path d="M3.5 8v8.5" />
      <path d="M16 12.5h4.5" />
    </>
  ),
  // ===== Waktu / alam =====
  sun: () => (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19" />
    </>
  ),
  moon: () => <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />,
  calendar: () => (
    <>
      <rect x="3.5" y="5" width="17" height="16" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13.5h2M12 13.5h2M16.5 13.5h2M7.5 17h2M12 17h2" />
    </>
  ),
  grid: () => (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" />
      <rect x="13" y="13" width="7.5" height="7.5" />
    </>
  ),
}

// Alias agar nama-nama lama tetap berfungsi tanpa duplikasi kode.
const aliases: Record<string, string> = {
  nature: 'leaf',
  paint: 'palette',
  teacher: 'graduation',
  math: 'calculator',
  books: 'book',
}

const DEFAULT_ICON = 'sparkles'

export default function Icon({ name, className, strokeWidth = 1.8 }: { name: string; className?: string; strokeWidth?: number }) {
  const resolved = aliases[name] ?? name
  const def = paths[resolved] ?? paths[DEFAULT_ICON]
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {def()}
    </svg>
  )
}
