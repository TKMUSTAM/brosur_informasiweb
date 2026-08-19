import { Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { PrayerScheduleCard } from '../components/PrayerSchedule'
import { formatGregorianLong } from '../lib/hijri'
import { useSEO } from '../hooks/useSEO'

export default function JadwalSholat() {
  useSEO({
    title: 'Jadwal Sholat',
    description: 'Jadwal sholat harian yang mengikuti lokasi Anda, dihitung berdasarkan posisi matahari.',
    path: '/jadwal-sholat',
  })

  return (
    <>
      <PageHeader
        eyebrow="Konten Islami"
        title="Jadwal Sholat"
        description="Jadwal sholat hari ini dihitung otomatis berdasarkan lokasi Anda."
        crumbs={[{ label: 'Konten Islami', href: '/konten-islami' }, { label: 'Jadwal Sholat' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <PrayerScheduleCard />
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal delay={80}>
              <div className="flex items-start gap-3 rounded-card bg-softblue p-6">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-sm leading-relaxed text-secondary-dark">
                  <strong>Bagaimana jadwal ini dihitung?</strong> Jadwal dihitung menggunakan metode astronomis
                  (KEMENAG RI: Subuh 20°, Isya 18°) berdasarkan posisi matahari di koordinat Anda. Browser akan
                  meminta izin lokasi; bila ditolak, jadwal Jakarta ditampilkan.
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="rounded-card bg-softgreen p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Tanggal Hari Ini</p>
                <p className="mt-1 font-heading text-xl font-extrabold text-primary">{formatGregorianLong()}</p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-card bg-softyellow p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gold-dark/70">Catatan</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gold-dark">
                  Jadwal resmi Kemenag dapat berbeda 1–3 menit karena perbedaan metode dan koordinat referensi.
                  Untuk keperluan ibadah, silakan mengacu pada jadwal resmi setempat.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
