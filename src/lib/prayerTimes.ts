// ============================================================
// JADWAL SHOLAT — perhitungan astronomis (standar PrayTimes)
// Berbasis lokasi pengguna (latitude, longitude) + timezone device.
// Metode default: KEMENAG RI (Subuh 20°, Isya 18°), Ashar Syafi'i.
// ============================================================

export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya'
export type PrayerTimes = Record<PrayerName, string> & {
  imsak: string
  sunrise: string
  dateLabel: string
  city: string
}

export const PRAYER_LABELS: Record<PrayerName, string> = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
}

const D = Math.PI / 180
const CONFIG = { fajr: 20, isha: 18, maghrib: 0.833, asrFactor: 1 }

function julianDay(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  const tz = date.getTimezoneOffset() / 60 // UTC offset in hours
  return jdn + ((date.getHours() - 12 + tz) / 24)
}

/**
 * Posisi matahari → deklinasi (°) dan equation of time (JAM).
 * Catatan: koreksi lintang ekliptika (1.915° & 0.02°) dikonversi ke radian
 * agar konsisten dengan sudut g/q yang sudah dalam radian.
 */
function sunPosition(jd: number): { declination: number; equationOfTime: number } {
  const d = jd - 2451545.0
  const g = ((357.529 + 0.98560028 * d) % 360) * D // anomali rata-rata (rad)
  const q = ((280.459 + 0.98564736 * d) % 360) * D // bujur rata-rata (rad)
  const L = q + 1.915 * D * Math.sin(g) + 0.02 * D * Math.sin(2 * g) // bujur sejati (rad)
  const e = 23.439 - 0.00000036 * d // oblikuitas (°)
  const declination = Math.asin(Math.sin(e * D) * Math.sin(L)) / D // °
  const RAdeg = ((Math.atan2(Math.cos(e * D) * Math.sin(L), Math.cos(L)) / D) + 360) % 360 // °
  let eotDeg = q / D - RAdeg
  eotDeg = ((eotDeg % 360) + 540) % 360 - 180 // normalisasi ke [-180, 180)
  return { declination, equationOfTime: eotDeg / 15 } // jam
}

/**
 * Sudut jam matahari. `angle` dalam derajat POSITIF di bawah horizon
 * (mis. fajr 20 → matahari 20° di bawah horizon). Rumus standar PrayTimes
 * menggunakan -sin(angle) karena sin negatif untuk posisi di bawah horizon.
 */
function hourAngle(angle: number, lat: number, decl: number): number {
  const cosH =
    (-Math.sin(angle * D) - Math.sin(lat * D) * Math.sin(decl * D)) /
    (Math.cos(lat * D) * Math.cos(decl * D))
  if (cosH > 1 || cosH < -1) return 0 // clamp lintang ekstrem
  return Math.acos(cosH) / D / 15
}

function timeFromMidday(date: Date, hours: number): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setTime(d.getTime() + hours * 3600 * 1000)
  return d
}

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    .format(d)
    .replace(/\./g, ':')
}

export function computePrayerTimes(
  lat: number,
  _lng: number,
  city: string,
  date = new Date(),
): PrayerTimes {
  const jd = julianDay(date)
  const { declination, equationOfTime } = sunPosition(jd)
  const noon = 12 - equationOfTime // jam — tengah hari matahari (local)

  const fix = (minutes: number) => timeFromMidday(date, noon + minutes / 60)

  const fajr = fix(-hourAngle(CONFIG.fajr, lat, declination) * 60)
  const sunrise = fix(-hourAngle(CONFIG.maghrib, lat, declination) * 60)
  const sunset = fix(hourAngle(CONFIG.maghrib, lat, declination) * 60)
  const maghrib = new Date(sunset.getTime() + 2 * 60 * 1000)
  const isha = fix(hourAngle(CONFIG.isha, lat, declination) * 60)

  // Ashar: bayangan = faktor + tinggi matahari (sudut elevasi negatif)
  const asrAngle = Math.atan(
    1 / (CONFIG.asrFactor + Math.tan(Math.abs(lat - declination) * D)),
  )
  const cosH =
    (Math.sin(asrAngle) - Math.sin(lat * D) * Math.sin(declination * D)) /
    (Math.cos(lat * D) * Math.cos(declination * D))
  const asrHours = (Math.acos(Math.min(1, Math.max(-1, cosH))) / D / 15) * 60
  const ashar = fix(asrHours)

  return {
    imsak: formatTime(new Date(fajr.getTime() - 10 * 60 * 1000)),
    subuh: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dzuhur: formatTime(fix(0)),
    ashar: formatTime(ashar),
    maghrib: formatTime(maghrib),
    isya: formatTime(isha),
    dateLabel: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
    city,
  }
}

export const DEFAULT_LOCATION = { lat: -6.2088, lng: 106.8456, city: 'Jakarta' }

export type UserLocation = { lat: number; lng: number; city: string; fallback: boolean }

/** Mendapatkan lokasi pengguna; fallback ke Jakarta bila ditolak/tidak tersedia. */
export function getLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ ...DEFAULT_LOCATION, fallback: true })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city: 'Lokasi Anda',
          fallback: false,
        })
      },
      () => resolve({ ...DEFAULT_LOCATION, fallback: true }),
      { timeout: 6000, maximumAge: 600000 },
    )
  })
}
