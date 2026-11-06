import { usePrayer } from '../hooks/usePrayer'
import { PRAYER_LABELS, type PrayerName, type PrayerTimes } from '../lib/prayerTimes'
import { FaClock, FaLocationDot } from 'react-icons/fa6'
import { LuSunrise, LuSunset } from 'react-icons/lu'

const order: PrayerName[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']

/** Waktu sholat berikutnya berdasarkan jam sekarang (untuk highlight). */
function nextPrayer(times: PrayerTimes): PrayerName {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const parsed = order.map((p) => {
    const [h, m] = times[p].split(':').map(Number)
    return { name: p, min: h * 60 + m }
  })
  const next = parsed.find((t) => t.min > nowMin)
  return next ? next.name : order[0]
}

export function PrayerTimesGrid({ compact = false }: { compact?: boolean }) {
  const { times, loading } = usePrayer()

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-1.5 rounded-xl bg-white/60 p-1.5 w-full border border-primary/10" role="status" aria-label="Memuat jadwal sholat">
        {order.map((p) => (
          <div key={p} className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-cream/70 py-2 animate-pulse">
            <span className="h-2 w-8 rounded-full bg-primary/10" />
            <span className="h-3.5 w-10 rounded-full bg-primary/10" />
          </div>
        ))}
      </div>
    )
  }

  if (!times) return null

  const currentNext = nextPrayer(times)

  if (compact) {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Grid 5 Waktu Sholat */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 rounded-xl bg-white/90 p-1.5 border border-primary/10 w-full shadow-xs">
          {order.map((p) => {
            const active = p === currentNext
            return (
              <div
                key={p}
                className={`flex min-w-0 flex-col items-center justify-center rounded-lg py-1.5 px-1 text-center transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm ring-1 ring-primary/20 scale-[1.02]'
                    : 'text-ink-soft hover:bg-cream/70'
                }`}
              >
                <span
                  className={`block w-full text-[10px] sm:text-[11px] font-semibold leading-tight tracking-tight ${
                    active ? 'text-gold-light font-bold' : 'text-ink-mute'
                  }`}
                  title={PRAYER_LABELS[p]}
                >
                  {PRAYER_LABELS[p]}
                </span>
                <span
                  className={`mt-1 block font-heading text-xs sm:text-[13px] font-extrabold tabular-nums leading-none ${
                    active ? 'text-white' : 'text-ink'
                  }`}
                >
                  {times[p]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Status Lokasi & Waktu Sholat (Ketengah) */}
        <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-ink-mute text-center">
          <span className="inline-flex items-center gap-1 font-medium text-ink-soft">
            <FaLocationDot className="h-3 w-3 text-gold-dark shrink-0" />
            <span>{times.city}</span>
          </span>
          <span className="text-ink-mute/50">•</span>
          <span className="text-[10px] font-semibold text-primary/80 bg-softgreen px-2 py-0.5 rounded-md border border-primary/10">
            Deteksi Otomatis
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {order.map((p) => {
          const active = p === currentNext
          return (
            <div
              key={p}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-all sm:py-4 ${
                active ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-ink hover:bg-white border border-primary/5'
              }`}
            >
              <span className={`text-[11px] font-semibold tracking-tight sm:text-xs ${active ? 'text-gold-light' : 'text-ink-mute'}`}>
                {PRAYER_LABELS[p]}
              </span>
              <span className="font-heading text-base font-extrabold tabular-nums sm:text-lg">{times[p]}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-mute">
        <FaLocationDot className="h-3.5 w-3.5 text-gold-dark" />
        {times.city} • {times.dateLabel}
      </div>
    </div>
  )
}

/** Kartu jadwal lengkap dengan waktu imsak & terbit matahari. */
export function PrayerScheduleCard() {
  const { times, loading } = usePrayer()

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-soft border border-primary/10">
      <div className="flex items-center justify-between gap-3 bg-primary px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <FaClock className="h-5 w-5 text-gold" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Jadwal Sholat</h2>
            <p className="text-xs text-white/70">
              {times ? `${times.city} • ${times.dateLabel}` : 'Mengikuti lokasi Anda'}
            </p>
          </div>
        </div>
        {loading && <span className="h-5 w-24 animate-pulse rounded-full bg-white/20" />}
      </div>

      <div className="p-6">
        {times ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-xl bg-softyellow px-4 py-3">
                <span className="text-sm font-semibold text-ink-soft">Imsak</span>
                <span className="font-heading text-base font-extrabold text-gold-ink">{times.imsak}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-softblue px-4 py-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                  <LuSunrise className="h-4 w-4 text-secondary" /> Terbit
                </span>
                <span className="font-heading text-base font-extrabold text-secondary-dark">{times.sunrise}</span>
              </div>
            </div>
            {order.map((p) => (
              <div key={p} className="flex items-center justify-between rounded-xl bg-cream px-5 py-3.5 transition-colors hover:bg-softgreen">
                <span className="font-heading text-base font-extrabold text-primary">{PRAYER_LABELS[p]}</span>
                <span className="font-heading text-lg font-extrabold tabular-nums text-primary">{times[p]}</span>
              </div>
            ))}
            <p className="flex items-center gap-1.5 pt-1 text-xs text-ink-mute">
              <LuSunset className="h-3.5 w-3.5 text-gold-dark" /> Jadwal dihitung otomatis berdasarkan koordinat lokasi perangkat Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-cream" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
