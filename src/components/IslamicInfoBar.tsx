import { Link } from 'react-router-dom'
import { formatGregorianLong, formatHijri } from '../lib/hijri'
import { PrayerTimesGrid } from './PrayerSchedule'
import { doas } from '../data/content'
import {
  RiCalendar2Line,
  RiArrowRightSLine,
} from 'react-icons/ri'
import {
  FaClock,
  FaHandsPraying,
  FaMosque,
} from 'react-icons/fa6'

/**
 * Islamic Info Bar — bar horizontal di bawah hero:
 * Kalender Hijriyah • Jadwal Sholat • Doa Hari Ini • Kajian.
 * Didesain simetris, responsif, dan terpusat dengan react-icons tematik.
 */
export default function IslamicInfoBar() {
  const today = new Date()
  const doa = doas[(today.getDate() - 1) % doas.length]

  return (
    <section aria-label="Informasi Islami hari ini" className="relative z-10 -mt-6 sm:-mt-10 px-4 sm:px-6">
      <div className="mx-auto max-w-[1440px] rounded-2xl border border-primary/15 bg-white/95 p-4 sm:p-6 shadow-lift backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Kalender Hijriyah */}
          <div className="flex flex-col items-center justify-between rounded-2xl bg-cream/40 p-4 sm:p-5 border border-primary/10 text-center transition-all hover:bg-cream/70 hover:border-primary/20">
            <div className="flex flex-col items-center w-full">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary shadow-2xs mb-2">
                <RiCalendar2Line className="h-5 w-5" />
              </span>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">
                Kalender Hijriyah
              </p>
              <p className="mt-1 font-heading text-base sm:text-lg font-bold leading-tight text-primary">
                {formatHijri(today)}
              </p>
            </div>
            <p className="mt-2 text-xs font-medium text-ink-soft bg-white/80 px-2.5 py-1 rounded-full border border-primary/5">
              {formatGregorianLong(today)}
            </p>
          </div>

          {/* Card 2: Jadwal Sholat */}
          <div className="flex flex-col items-center justify-between rounded-2xl bg-cream/40 p-4 sm:p-5 border border-primary/10 text-center transition-all hover:bg-cream/70 hover:border-primary/20">
            <div className="w-full flex flex-col items-center">
              <div className="mb-2.5 flex items-center justify-center gap-1.5 text-ink-mute">
                <FaClock className="h-4 w-4 text-gold-dark" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  Jadwal Sholat
                </span>
              </div>
              <PrayerTimesGrid compact />
            </div>
          </div>

          {/* Card 3: Doa Harian Murid */}
          <div className="flex flex-col items-center justify-between rounded-2xl bg-cream/40 p-4 sm:p-5 border border-primary/10 text-center transition-all hover:bg-cream/70 hover:border-primary/20">
            <Link to="/doa" className="group flex flex-col items-center justify-between h-full w-full">
              <div className="flex flex-col items-center w-full">
                <div className="mb-2 flex items-center justify-center gap-1.5 text-ink-mute">
                  <FaHandsPraying className="h-4 w-4 text-gold-dark" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Doa Harian Murid
                  </span>
                </div>
                <p className="font-heading text-sm sm:text-base font-bold leading-snug text-primary transition-colors group-hover:text-primary-light">
                  {doa.title}
                </p>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft italic max-w-xs">
                  "{doa.meaning}"
                </p>
              </div>
              <span className="mt-3 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-primary transition-all group-hover:gap-1.5">
                <span>Baca doa selengkapnya</span>
                <RiArrowRightSLine className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Card 4: Agenda / Kajian */}
          <div className="flex flex-col items-center justify-between rounded-2xl bg-cream/40 p-4 sm:p-5 border border-primary/10 text-center transition-all hover:bg-cream/70 hover:border-primary/20">
            <Link to="/berita" className="group flex flex-col items-center justify-between h-full w-full">
              <div className="flex flex-col items-center w-full">
                <div className="mb-2 flex items-center justify-center gap-1.5 text-ink-mute">
                  <FaMosque className="h-4 w-4 text-gold-dark" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Agenda / Kajian
                  </span>
                </div>
                <p className="font-heading text-sm sm:text-base font-bold leading-snug text-primary transition-colors group-hover:text-primary-light">
                  Kajian Parenting Islami
                </p>
                <p className="mt-1 text-xs font-semibold text-ink-soft">
                  Sabtu, 09.00 WIB • Masjid Utama
                </p>
              </div>
              <span className="mt-3 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-primary transition-all group-hover:gap-1.5">
                <span>Jadwal lengkap</span>
                <RiArrowRightSLine className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
