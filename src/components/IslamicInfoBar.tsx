import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Icon from './Icon'
import { formatGregorianLong, formatHijri } from '../lib/hijri'
import { PrayerTimesGrid } from './PrayerSchedule'
import { doas } from '../data/content'

/**
 * Islamic Info Bar — bar horizontal di bawah hero:
 * Kalender Hijriyah • Jadwal Sholat • Doa Hari Ini • Kajian.
 */
export default function IslamicInfoBar() {
  const today = new Date()
  const doa = doas[(today.getDate() - 1) % doas.length]

  return (
    <section aria-label="Informasi Islami hari ini" className="relative z-10 -mt-10 px-4 sm:px-6">
      <div className="mx-auto max-w-[1440px] rounded-card-lg border border-primary/15 bg-white/95 p-5 shadow-lift backdrop-blur-2xl ring-1 ring-black/5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.3fr_1fr_0.7fr] lg:divide-x lg:divide-primary/10">
          {/* Kalender */}
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-softgreen text-primary shadow-soft">
              <Icon name="calendar" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">Kalender Hijriyah</p>
              <p className="mt-1 font-heading text-lg font-extrabold leading-tight text-primary">{formatHijri(today)}</p>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-ink-soft">{formatGregorianLong(today)}</p>
            </div>
          </div>

          {/* Jadwal sholat */}
          <div className="lg:pl-7">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
              Jadwal Sholat <span className="font-semibold normal-case text-ink-mute">(lokasi otomatis)</span>
            </p>
            <PrayerTimesGrid compact />
          </div>

          {/* Doa hari ini */}
          <div className="lg:pl-7">
            <Link to="/doa" className="group block">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
                Doa Hari Ini
              </p>
              <p className="font-heading text-base font-extrabold leading-snug text-primary transition-colors group-hover:text-primary-light">
                {doa.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{doa.meaning}</p>
            </Link>
          </div>

          {/* Kajian */}
          <div className="lg:pl-7">
            <Link to="/berita" className="group flex h-full flex-col">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
                Kajian / Kegiatan
              </p>
              <p className="font-heading text-base font-extrabold leading-snug text-primary transition-colors group-hover:text-primary-light">
                Kajian Parenting
                <span className="block text-xs sm:text-sm font-semibold text-ink-soft">Sabtu, 09.00 WIB</span>
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs sm:text-sm font-bold text-warmred transition-all group-hover:gap-2">
                Jadwal lengkap <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
