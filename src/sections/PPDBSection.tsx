import { FaWhatsapp } from 'react-icons/fa6'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { ButtonLink } from '../components/Buttons'
import { useCMS } from '../hooks/useCMS'

const timeline = [
  { no: '01', title: 'Isi Formulir Online', desc: 'Isi data orang tua dan calon murid melalui portal mandiri PPDB Al-Mustam.' },
  { no: '02', title: 'Unggah Berkas', desc: 'Upload foto/scan Kartu Keluarga, Akta Kelahiran, dan pasfoto calon murid.' },
  { no: '03', title: 'Konfirmasi WhatsApp', desc: 'Dapatkan nomor registrasi dan jadwal observasi ramah anak dari panitia.' },
  { no: '04', title: 'Observasi Ceria', desc: 'Sesi temu ramah anak bersama ustadzah untuk pemetaan gaya belajar anak.' },
  { no: '05', title: 'Daftar Ulang & Seragam', desc: 'Penerbitan Nomor Induk Siswa (NIS) resmi dan pengambilan perlengkapan seragam.' },
]

export default function PPDBSection() {
  const { data } = useCMS()
  const { site } = data
  const ppdb = data.pageContent.ppdb
  const waves = ppdb.waves || [
    {
      id: 'gelombang-1',
      name: 'Gelombang 1 (Early Bird & Beasiswa Yatim)',
      period: '1 Jan – 30 April 2026',
      quota: 'Sisa 8 Kuota',
      status: 'OPEN',
      description: 'Potongan biaya sarana pendidikan & beasiswa khusus yatim.',
    },
    {
      id: 'gelombang-2',
      name: 'Gelombang 2 (Reguler)',
      period: '1 Mei – 10 Juli 2026',
      quota: '30 Kuota Tersedia',
      status: 'UPCOMING',
      description: 'Penerimaan reguler tahun ajaran baru 2026/2027.',
    },
  ]
  const hasOpenWave = waves.some((w) => w.status === 'OPEN')
  const isOpen = Boolean(ppdb.registrationOpen && hasOpenWave)

  return (
    <section className="relative overflow-hidden bg-cream px-4 py-20 sm:px-6 sm:py-24 border-t border-primary/10" aria-label={`PPDB ${ppdb.academicYear}`}>
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading tanpa pengulangan kata */}
        <SectionHeading
          eyebrow={`Tahun Ajaran ${ppdb.academicYear}`}
          title="Pendaftaran Peserta Didik Baru (PPDB)"
          subtitle="Alur pendaftaran murid baru kini dikelola secara mandiri, transparan, dan mudah diakses langsung secara online."
        />

        {/* 5-Step Timeline Cards */}
        <div className="relative mt-12">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((step, i) => (
              <Reveal as="li" key={step.no} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-soft">
                  <div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-xs font-black text-white shadow-xs">
                      {step.no}
                    </span>
                    <h3 className="mt-3.5 font-heading text-base font-bold text-primary">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Status 2 Gelombang Pendaftaran */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {waves.map((wave, idx) => {
            const isWaveActive = wave.status === 'OPEN' && ppdb.registrationOpen
            return (
              <Reveal key={wave.id} delay={idx * 80}>
                <div
                  className={`rounded-3xl p-6 border transition-all space-y-3 ${
                    isWaveActive
                      ? 'border-primary/20 bg-white shadow-soft'
                      : 'border-primary/10 bg-cream/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-black uppercase tracking-wider text-primary">
                      Gelombang {idx + 1}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        wave.status === 'OPEN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : wave.status === 'CLOSED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {wave.status === 'OPEN' ? '🟢 DIBUKA' : wave.status === 'CLOSED' ? '🔴 DITUTUP' : '🟡 BELUM DIBUKA'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading text-base font-extrabold text-primary">{wave.name}</h4>
                    <p className="text-xs text-ink-mute mt-1">
                      <strong>Jadwal:</strong> {wave.period} {wave.quota ? `• ${wave.quota}` : ''}
                    </p>
                    {wave.description && (
                      <p className="text-xs text-ink-soft mt-1.5 italic">"{wave.description}"</p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Unified Action Card: Menggabungkan info penting dan aksi buka/tutup pendaftaran */}
        <Reveal delay={120} className="mt-10 rounded-3xl bg-primary text-white p-6 sm:p-8 lg:p-10 shadow-lift border border-primary-light/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span
                  className={`rounded-full px-3.5 py-1 font-bold ${
                    isOpen
                      ? 'bg-gold/20 text-gold-light border border-gold/30'
                      : 'bg-warmred/30 text-white border border-warmred/40'
                  }`}
                >
                  {isOpen ? '● Pendaftaran Dibuka' : '○ Pendaftaran Ditutup'}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">KB (3–4 th) &amp; TK A–B (4–6 th)</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">Maksimal 15 Murid / Kelas</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-white">
                {isOpen ? 'Siap Mendaftarkan Buah Hati Anda?' : 'Pendaftaran Saat Ini Sedang Ditutup'}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {isOpen
                  ? 'Gunakan formulir digital mandiri untuk pengisian data keluarga, pemilihan jenjang kelas, serta pengunggahan berkas secara aman.'
                  : 'Kuota penerimaan murid baru untuk gelombang aktif telah terpenuhi atau sedang dalam masa rekapitulasi. Silakan hubungi panitia untuk informasi gelombang berikutnya atau antrean waiting list.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 w-full lg:w-auto">
              {isOpen ? (
                <ButtonLink
                  to="/ppdb/daftar"
                  variant="gold"
                  size="lg"
                  withArrow
                  className="text-center font-bold text-sm shadow-gold"
                >
                  Buka Formulir PPDB Online
                </ButtonLink>
              ) : (
                <ButtonLink
                  to="/ppdb"
                  variant="white"
                  size="lg"
                  className="text-center font-bold text-sm bg-white/10 text-white border border-white/20 hover:bg-white/20"
                >
                  Lihat Rincian Biaya &amp; Syarat
                </ButtonLink>
              )}

              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
                  isOpen
                    ? 'Assalamualaikum Panitia PPDB, saya ingin konsultasi pendaftaran murid baru TK Islam Al-Mustam.'
                    : 'Assalamualaikum Panitia PPDB, saya ingin menanyakan jadwal pembukaan gelombang pendaftaran murid baru berikutnya di TK Islam Al-Mustam.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/20"
              >
                <FaWhatsapp className="h-4 w-4 text-gold-light" />
                <span>{isOpen ? 'Konsultasi Panitia' : 'Tanya Jadwal Gelombang Baru'}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
