import { useEffect, useState } from 'react'
import { computePrayerTimes, getLocation, type PrayerTimes } from '../lib/prayerTimes'

export type PrayerState = {
  times: PrayerTimes | null
  loading: boolean
  error: string | null
  usingFallback: boolean
}

export function usePrayer(): PrayerState {
  const [times, setTimes] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timer: number

    const update = () => {
      const now = new Date()
      getLocation().then((loc) => {
        if (cancelled) return
        setTimes(computePrayerTimes(loc.lat, loc.lng, loc.city, now))
        setUsingFallback(loc.fallback)
        setLoading(false)
        setError(loc.fallback ? 'Lokasi tidak terdeteksi — menampilkan jadwal Jakarta.' : null)
      })
    }

    update()
    // Refresh tiap 60 detik agar jadwal selalu akurat
    timer = window.setInterval(update, 60_000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return { times, loading, error, usingFallback }
}
