import { AlertCircle, Clock, LocateFixed, Sunrise, Sunset } from 'lucide-react'
import { usePrayer } from '../hooks/usePrayer'
import { PRAYER_LABELS, type PrayerName, type PrayerTimes } from '../lib/prayerTimes'

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
  const { times, loading, error, usingFallback } = usePrayer()

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-2 sm:gap-3" role="status" aria-label="Memuat jadwal sholat">
        {order.map((p) => (
          <div key={p} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/60 p-3 animate-pulse">
            <span className="h-2.5 w-14 rounded-full bg-primary/10" />
            <span className="h-5 w-12 rounded-full bg-primary/10" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {times && (
        <div className={`grid grid-cols-5 gap-2 sm:gap-3 ${compact ? '' : 'sm:grid-cols-5'}`}>
          {order.map((p) => {
            const active = p === nextPrayer(times)
            return (
              <div
                key={p}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-all sm:py-4 ${
                  active ? 'bg-gold text-primary shadow-gold' : 'bg-white/70 text-ink hover:bg-white'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider sm:text-xs ${active ? 'text-primary' : 'text-ink-mute'}`}>
                  {PRAYER_LABELS[p]}
                </span>
                <span className="font-heading text-base font-extrabold tabular-nums sm:text-lg">{times[p]}</span>
              </div>
            )
          })}
        </div>
      )}
      {(error || usingFallback) && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute">
          <AlertCircle className="h-3.5 w-3.5" />
          {error ?? 'Menampilkan jadwal lokasi Anda.'}
        </p>
      )}
      {times && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-mute">
          <LocateFixed className="h-3.5 w-3.5 text-gold-dark" />
          {times.city} • {times.dateLabel}
        </p>
      )}
    </div>
  )
}

/** Kartu jadwal lengkap dengan waktu imsak & terbit matahari. */
export function PrayerScheduleCard() {
  const { times, loading, error, usingFallback } = usePrayer()

  return (
    <div className="overflow-hidden rounded-card bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 bg-primary px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Clock className="h-5 w-5 text-gold" />
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
                  <Sunrise className="h-4 w-4 text-secondary" /> Terbit
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
              <Sunset className="h-3.5 w-3.5 text-gold-dark" /> Jadwal dihitung otomatis berdasarkan posisi matahari di lokasi Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-cream" />
            ))}
          </div>
        )}
        {(error || usingFallback) && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-softyellow px-4 py-3 text-xs leading-relaxed text-gold-ink">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error ?? 'Perkiraan jadwal berdasarkan waktu matahari; jadwal resmi dapat berbeda 1–3 menit.'}
          </p>
        )}
      </div>
    </div>
  )
}
