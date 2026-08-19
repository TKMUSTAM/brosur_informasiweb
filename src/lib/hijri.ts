// ============================================================
// KALENDER HIJRIYAH
// Menggunakan Intl islamic-umalqura bila didukung, dengan
// fallback algoritma Kuwaiti (tabular) untuk browser lama.
// ============================================================

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir',
  'Rajab', 'Syaban', 'Ramadhan', 'Syawal', 'Dzulqaidah', 'Dzulhijjah',
]

/** Pemetaan nama bulan hijriah berbahasa Inggris (Intl) → Indonesia */
const HIJRI_EN_TO_ID: Record<string, string> = {
  'Muharram': 'Muharram',
  'Safar': 'Safar',
  'Rabi\u02bf I': 'Rabiul Awal',
  'Rabi\u2018 I': 'Rabiul Awal',
  'Rabi I': 'Rabiul Awal',
  'Rabi\u02bf al-awwal': 'Rabiul Awal',
  'Rabi\u2018 al-awwal': 'Rabiul Awal',
  'Rabi\u02bf II': 'Rabiul Akhir',
  'Rabi\u2018 II': 'Rabiul Akhir',
  'Rabi II': 'Rabiul Akhir',
  'Rabi\u02bf al-thani': 'Rabiul Akhir',
  'Jumada I': 'Jumadil Awal',
  'Jum\u0101d\u0101 I': 'Jumadil Awal',
  'Jum\u0101d\u0101 al-\u016bl\u0101': 'Jumadil Awal',
  'Jumada II': 'Jumadil Akhir',
  'Jum\u0101d\u0101 II': 'Jumadil Akhir',
  'Jum\u0101d\u0101 al-\u0101khirah': 'Jumadil Akhir',
  'Rajab': 'Rajab',
  'Sha\u02bfban': 'Syaban',
  'Sha\u2018ban': 'Syaban',
  'Sha\u02bfb\u0101n': 'Syaban',
  'Ramadan': 'Ramadhan',
  'Rama\u1e0d\u0101n': 'Ramadhan',
  'Shawwal': 'Syawal',
  'Shaww\u0101l': 'Syawal',
  'Dhu\u02bfl-Qi\u02bfdah': 'Dzulqaidah',
  'Dhu\u2018l-Qi\u2018dah': 'Dzulqaidah',
  'Dhu\u02bfl-Hijjah': 'Dzulhijjah',
  'Dhu\u2018l-Hijjah': 'Dzulhijjah',
}

function toIndonesianMonth(en: string): string {
  if (HIJRI_EN_TO_ID[en]) return HIJRI_EN_TO_ID[en]
  // fallback: pencocokan awalan untuk variasi penulisan
  const lower = en.toLowerCase()
  if (lower.startsWith('muharram')) return 'Muharram'
  if (lower.startsWith('safar')) return 'Safar'
  if (lower.includes('rabi') || lower.includes('\u02bfi')) {
    if (lower.includes('i\u02bf') || lower.includes('i\u2018') || /i+[\s'\u02bf\u2018]*$/.test(lower)) return 'Rabiul Awal'
  }
  if (lower.includes('jumada') || lower.includes('juma')) return 'Jumadil Awal'
  if (lower.startsWith('rajab')) return 'Rajab'
  if (lower.includes('sha')) return 'Syaban'
  if (lower.includes('ramad')) return 'Ramadhan'
  if (lower.includes('shaw')) return 'Syawal'
  if (lower.includes('dhu') || lower.includes('dzu')) {
    if (lower.includes('hijj')) return 'Dzulhijjah'
    return 'Dzulqaidah'
  }
  return en
}

function toJulianDay(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  )
}

/** Algoritma tabular Kuwaiti — fallback akurat ±1 hari */
function toHijriTabular(date: Date): { day: number; month: number; year: number } {
  const jd = toJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
  let jdH = jd - 1948440 + 10632
  const n = Math.floor((jdH - 1) / 10631)
  jdH = jdH - 10631 * n + 354
  const j =
    Math.floor((10985 - jdH) / 5316) * Math.floor((50 * jdH) / 17719) +
    Math.floor(jdH / 5670) * Math.floor((43 * jdH) / 15238)
  jdH =
    jdH -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29
  const month = Math.floor((24 * jdH) / 709)
  const day = jdH - Math.floor((709 * month) / 24)
  const year = 30 * n + j - 30
  return { day, month: month + 1, year }
}

export type HijriDate = { day: number; month: number; year: number; monthName: string }

const supportsIntlHijri =
  typeof Intl !== 'undefined' &&
  (() => {
    try {
      return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura').format(new Date()).length > 0
    } catch {
      return false
    }
  })()

export function getHijriDate(date = new Date()): HijriDate {
  if (supportsIntlHijri) {
    try {
      const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      // format "10 Safar 1448 AH"
      const parts = fmt.formatToParts(date)
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '1'
      const year = parseInt(get('year'), 10)
      return {
        day: parseInt(get('day'), 10),
        month: 0,
        year,
        monthName: toIndonesianMonth(get('month')),
      }
    } catch {
      /* fall through */
    }
  }
  const t = toHijriTabular(date)
  return {
    day: t.day,
    month: t.month,
    year: t.year,
    monthName: HIJRI_MONTHS[t.month - 1] ?? '',
  }
}

export function formatHijri(date = new Date()): string {
  const h = getHijriDate(date)
  return `${h.day} ${h.monthName} ${h.year} H`
}

export function formatGregorianLong(date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return fmt.format(date)
}
