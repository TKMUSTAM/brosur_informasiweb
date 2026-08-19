import { useState } from 'react'
import { Calculator, Download, CheckCircle2, Heart, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { programs } from '../data/programs'
import { site } from '../data/site'

const timeline = [
  { no: '01', title: 'Isi Formulir Online', desc: 'Isi formulir online di website atau kunjungi sekretariat sekolah.' },
  { no: '02', title: 'Konfirmasi WhatsApp', desc: 'Dapatkan nomor registrasi dan verifikasi berkas via admin WhatsApp.' },
  { no: '03', title: 'Observasi Ceria Anak', desc: 'Observasi ramah anak & konsultasi tumbuh kembang bersama psikolog/guru.' },
  { no: '04', title: 'Pengumuman & Daftar Ulang', desc: 'Pemberitahuan hasil penempatan kelas dan fitting seragam sekolah.' },
  { no: '05', title: 'Orientasi & Masuk Sekolah', desc: 'Kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) yang menyenangkan.' },
]

const requirements = [
  'Fotokopi Kartu Keluarga (KK) 2 lembar',
  'Fotokopi Akta Kelahiran Anak 2 lembar',
  'Pas foto berwarna anak ukuran 3×4 (3 lembar)',
  'Fotokopi KTP kedua orang tua / wali',
  'Mengisi formulir pendaftaran dan surat pernyataan orang tua',
  'Surat Keterangan Kematian Orang Tua (Khusus pendaftar Jalur Beasiswa Yatim)',
]

const feeBreakdown = [
  { item: 'Biaya Pendaftaran & Observasi Anak', nominal: 'Rp 150.000', note: 'Sekali bayar di awal pendaftaran' },
  { item: 'Uang Pangkal / Infaq Gedung', nominal: 'Rp 2.500.000', note: 'Dapat dicicil hingga 3x pembayaran' },
  { item: 'Paket Seragam & Atribut (4 Setel)', nominal: 'Rp 750.000', note: 'Batik, Muslim Hijau, Olahraga, & Pramuka/Rompi' },
  { item: 'Paket Buku Sentra & Alat Peraga (1 Thn)', nominal: 'Rp 450.000', note: 'Termasuk buku tilawati, sains kit, & bahan seni' },
  { item: 'SPP Bulanan (Sudah termasuk Snack Sehat)', nominal: 'Rp 250.000', note: 'Per bulan, bebas biaya ujian/kegiatan rutin' },
]

export default function PPDB() {
  useSEO({
    title: 'PPDB 2026/2027 — Pendaftaran Siswa Baru TK Islam Al-Mustam',
    description: 'Penerimaan Peserta Didik Baru (PPDB) 2026/2027 KB, TK A, TK B, dan TPA Al-Mustam. Rincian biaya transparan dan beasiswa yatim penuh.',
    path: '/ppdb',
  })

  // State untuk kalkulator usia anak
  const [birthDate, setBirthDate] = useState('')
  const [calcResult, setCalcResult] = useState<{ ageStr: string; recommendation: string; programSlug: string } | null>(null)

  const handleCalculateAge = () => {
    if (!birthDate) return
    const birth = new Date(birthDate)
    // Hitung per 1 Juli 2026 (Tahun ajaran baru)
    const targetDate = new Date('2026-07-01')
    
    let years = targetDate.getFullYear() - birth.getFullYear()
    let months = targetDate.getMonth() - birth.getMonth()
    if (months < 0) {
      years--
      months += 12
    }

    const totalMonths = years * 12 + months
    const ageStr = `${years} Tahun ${months} Bulan`

    let recommendation = ''
    let programSlug = 'tk-a'

    if (totalMonths < 36) {
      recommendation = 'Ananda masih di bawah 3 tahun. Disarankan masuk Daycare / Program Stimulasi Rumah.'
      programSlug = 'kb'
    } else if (totalMonths >= 36 && totalMonths < 48) {
      recommendation = 'Sangat tepat untuk masuk Kelompok Bermain (Playgroup / KB).'
      programSlug = 'kb'
    } else if (totalMonths >= 48 && totalMonths < 60) {
      recommendation = 'Sangat tepat untuk masuk Taman Kanak-Kanak Kelompok A (TK A).'
      programSlug = 'tk-a'
    } else if (totalMonths >= 60 && totalMonths <= 84) {
      recommendation = 'Sangat tepat untuk masuk Taman Kanak-Kanak Kelompok B (TK B) Persiapan SD.'
      programSlug = 'tk-b'
    } else {
      recommendation = 'Usia ananda sudah siap untuk jenjang Sekolah Dasar (SD) atau TPA Sore.'
      programSlug = 'tpa'
    }

    setCalcResult({ ageStr, recommendation, programSlug })
  }

  return (
    <>
      <PageHeader
        eyebrow="PPDB Tahun Ajaran 2026/2027"
        title="Bergabung Bersama Keluarga Besar TK Islam Al-Mustam"
        description="Penerimaan Peserta Didik Baru (KB, TK A, TK B, & TPA) telah dibuka. Tempat terbatas untuk menjaga rasio pendampingan ideal 1:7."
        crumbs={[{ label: 'PPDB 2026/2027' }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/ppdb/daftar" variant="gold" size="lg" withArrow className="shadow-gold">
            Daftar Online Sekarang
          </ButtonLink>
          <a
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin menanyakan brosur dan panduan PPDB TK Islam Al-Mustam.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/25"
          >
            <Download className="h-4 w-4 text-gold" />
            Unduh Brosur &amp; Rincian PDF
          </a>
        </div>
      </PageHeader>

      {/* ===== KALKULATOR USIA KELAYAKAN MASUK TK ===== */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal className="rounded-3xl border border-primary/10 bg-white p-7 shadow-lift sm:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-gold-ink">
                <Calculator className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-extrabold text-primary sm:text-xl">
                  Kalkulator Usia Masuk Sekolah
                </h2>
                <p className="text-xs text-ink-mute sm:text-sm">
                  Cek jenjang kelas yang paling cocok untuk ananda per 1 Juli 2026
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label htmlFor="tgl-lahir-calc" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Masukkan Tanggal Lahir Ananda
                </label>
                <input
                  id="tgl-lahir-calc"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-2xl border-2 border-primary/10 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleCalculateAge}
                  className="w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift sm:w-auto"
                >
                  Hitung Kelayakan Kelas
                </button>
              </div>
            </div>

            {calcResult && (
              <div className="mt-6 rounded-2xl border border-primary-mint/30 bg-softgreen p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-ink-mute">Usia ananda per Juli 2026:</p>
                    <p className="font-heading text-lg font-extrabold text-primary">{calcResult.ageStr}</p>
                    <p className="mt-1 text-sm font-bold text-primary-light">{calcResult.recommendation}</p>
                  </div>
                  <ButtonLink to="/ppdb/daftar" variant="primary" size="sm" withArrow className="mt-2 sm:mt-0">
                    Daftar Kelas Ini
                  </ButtonLink>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ===== PROGRAM YANG DIBUKA ===== */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Pilihan Jenjang"
            title="Jenjang Pendidikan yang Tersedia"
            subtitle="Disesuaikan dengan tahap perkembangan motorik, sosial, dan kognitif anak."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <div className="flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-softgreen px-3 py-1 text-xs font-extrabold text-primary">{p.code}</span>
                      <span className="text-xs font-bold text-gold-ink">{p.age}</span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-extrabold text-primary">{p.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-primary-mint">{p.subtitle}</p>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink-soft">{p.description}</p>
                  </div>
                  <div className="mt-6 border-t border-primary/5 pt-4">
                    <ButtonLink to={`/program/${p.slug}`} variant="ghost" size="sm" withArrow className="w-full justify-center">
                      Detail &amp; Kurikulum
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RINCIAN BIAYA PENDIDIKAN TRANSPARAN ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Rincian biaya pendidikan">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Investasi Pendidikan"
            title="Rincian Biaya Pendidikan yang Transparan"
            subtitle="Kami menjunjung tinggi kejelasan tanpa biaya tersembunyi, dengan opsi cicilan yang meringankan."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Tabel Rincian Biaya */}
            <Reveal className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft">
              <div className="border-b border-primary/10 bg-primary px-6 py-4 text-white">
                <h3 className="font-heading text-base font-extrabold">Struktur Biaya PPDB 2026/2027</h3>
                <p className="text-xs text-white/80">Berlaku untuk jenjang KB, TK A, dan TK B</p>
              </div>

              <div className="divide-y divide-primary/5 p-2 sm:p-4">
                {feeBreakdown.map((f) => (
                  <div key={f.item} className="flex flex-col justify-between gap-1 p-3.5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-bold text-primary">{f.item}</p>
                      <p className="text-xs text-ink-mute">{f.note}</p>
                    </div>
                    <span className="shrink-0 font-heading text-sm font-extrabold text-gold-dark sm:text-base">
                      {f.nominal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary/10 bg-cream p-4 text-center">
                <p className="text-xs text-ink-mute">
                  * Pembayaran uang pangkal dapat diangsur selama 3 bulan pertama.
                </p>
              </div>
            </Reveal>

            {/* Kotak Program Beasiswa Yatim */}
            <Reveal delay={100} className="flex flex-col justify-between rounded-3xl border border-warmred/20 bg-softred/30 p-8 shadow-soft">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warmred text-white shadow-soft">
                    <Heart className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="rounded-full bg-warmred px-3 py-0.5 text-[11px] font-extrabold text-white">
                      Program Sosial Yayasan
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-extrabold text-warmred-dark">
                      Beasiswa Penuh Yatim &amp; Dhuafa (100% Bebas Biaya)
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Yayasan Al-Mustam berkomitmen bahwa <strong>tidak boleh ada anak yatim atau dhuafa yang putus sekolah</strong> karena keterbatasan biaya. Seluruh biaya pendaftaran, uang pangkal, seragam, buku, dan SPP bulanan ditanggung 100% penuh oleh dana beasiswa yayasan.
                </p>

                <ul className="mt-4 space-y-2 text-xs font-semibold text-ink">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-warmred" />
                    <span>Gratis Biaya Pendaftaran &amp; Observasi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-warmred" />
                    <span>Gratis 100% Uang Pangkal &amp; SPP Bulanan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-warmred" />
                    <span>Diberikan Paket 4 Setel Seragam &amp; Buku Gratis</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 border-t border-warmred/10 pt-4">
                <ButtonLink to="/ppdb/daftar" variant="outline" className="w-full justify-center border-warmred text-warmred hover:bg-warmred hover:text-white">
                  Daftar Jalur Beasiswa Yatim
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ALUR PPDB ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Tahapan pendaftaran">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Alur Pendaftaran"
            title="5 Tahap Mudah Menjadi Santri Al-Mustam"
            subtitle="Proses pendaftaran yang praktis, transparan, dan ramah bagi orang tua dan anak."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((step, i) => (
              <Reveal key={step.no} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-heading text-sm font-extrabold text-white shadow-soft transition-transform group-hover:scale-110">
                      {step.no}
                    </span>
                    <h3 className="mt-5 font-heading text-base font-extrabold text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary-mint">
                    <Sparkles className="h-3 w-3" />
                    <span>Langkah {step.no}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SYARAT BERKAS & JADWAL GELOMBANG ===== */}
      <section id="syarat" className="scroll-mt-28 bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Syarat dan jadwal">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-2">
          
          {/* Persyaratan Berkas */}
          <Reveal className="rounded-3xl border border-primary/10 bg-white p-8 shadow-soft sm:p-10">
            <h2 className="font-heading text-xl font-extrabold text-primary">Kelengkapan Berkas Pendaftaran</h2>
            <p className="mt-1 text-xs text-ink-mute">Diserahkan saat observasi anak atau diunggah via form online</p>

            <ul className="mt-6 space-y-3.5">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-softgreen p-4 text-xs font-semibold text-primary">
              💡 Seluruh proses observasi dikemas dalam bentuk bermain ramah anak tanpa tes akademik yang memberatkan.
            </div>
          </Reveal>

          {/* Jadwal Gelombang */}
          <Reveal delay={100} className="rounded-3xl border border-primary/10 bg-white p-8 shadow-soft sm:p-10">
            <h2 className="font-heading text-xl font-extrabold text-primary">Jadwal Gelombang Pendaftaran</h2>
            <p className="mt-1 text-xs text-ink-mute">Tahun Ajaran 2026/2027</p>

            <dl className="mt-6 space-y-4">
              {[
                { label: 'Gelombang 1 (Early Bird Diskon 10% Uang Pangkal)', value: '1 Jan – 31 Maret 2026' },
                { label: 'Gelombang 2 (Reguler)', value: '1 April – 30 Juni 2026' },
                { label: 'Observasi & Pemetaan Karakter Anak', value: 'Setiap Sabtu (08.30–11.00 WIB)' },
                { label: 'Pengumuman Penempatan Kelas', value: '3 Hari Setelah Observasi' },
                { label: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', value: '13 – 17 Juli 2026' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col justify-between gap-1 border-b border-primary/5 pb-3.5 last:border-0 last:pb-0 sm:flex-row sm:items-center">
                  <dt className="text-xs font-bold text-ink-soft">{s.label}</dt>
                  <dd className="font-heading text-xs font-extrabold text-primary sm:text-sm">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={<>Amankan Kursi untuk Buah Hati Anda Sekarang</>}
        description="Kuota murid per kelas dibatasi maksimal 14 anak demi memastikan perhatian dan pendampingan optimal."
        primaryLabel="Isi Formulir Online"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Konsultasi WhatsApp"
        secondaryTo={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin menanyakan sisa kuota pendaftaran TK Islam Al-Mustam.')}`}
      />
    </>
  )
}
