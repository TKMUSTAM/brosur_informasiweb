import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { site } from '../data/site'

const milestones = [
  {
    year: '2012',
    title: 'Awal Mula — Majelis Taklim & TPQ Kecil',
    desc: 'Bermula dari majelis taklim dan TPQ kecil dengan 15 santri, semangat mengajarkan baca-tulis Al-Qur’an dan adab kepada anak-anak sekitar mulai bersemi.',
  },
  {
    year: '2016',
    title: 'Pendirian Resmi Yayasan Al-Mustam',
    desc: 'Yayasan resmi berbadan hukum melalui akta notaris dan SK Kemenkumham RI, memperkokoh tata kelola kelembagaan yang amanah dan transparan.',
  },
  {
    year: '2018',
    title: 'Pembukaan Kelompok Bermain (Playgroup / KB)',
    desc: 'KB dibuka untuk melayani anak usia 3–4 tahun dengan metode stimulasi sensori-motorik dan pembiasaan doa harian.',
  },
  {
    year: '2020',
    title: 'Peresmian TK Islam Al-Mustam (TK A & TK B)',
    desc: 'Menerapkan Kurikulum Merdeka yang terintegrasi muatan diniyah dan metode sentra (BCCT), dilengkapi ruang kelas ber-AC dan playground outdoor.',
  },
  {
    year: '2022',
    title: 'Peluncuran Beasiswa Penuh 100% Yatim Piatu',
    desc: 'Meluncurkan program beasiswa penuh bebas biaya pendidikan bagi anak-anak yatim dhuafa sebagai wujud kepedulian sosial yayasan.',
  },
  {
    year: '2026',
    title: 'Akreditasi A & 180+ Santri Aktif Berprestasi',
    desc: 'Kini menaungi 180+ siswa aktif dengan rasio pendampingan ideal 1:7, dipercaya ratusan keluarga sebagai mitra utama pendidikan usia dini.',
  },
]

export default function Sejarah() {
  useSEO({
    title: `Sejarah & Perjalanan — ${site.name}`,
    description: `Perjalanan ${site.name} dari majelis taklim kecil hingga menjadi yayasan pendidikan Islam modern terakreditasi A.`,
    path: '/sejarah',
  })

  return (
    <>
      <PageHeader
        eyebrow="Sejarah &amp; Perjalanan"
        title="Jejak Langkah Menebar Ilmu &amp; Kebaikan"
        description="Dari majelis taklim sederhana, tumbuh menjadi lembaga pendidikan Islam yang dipercaya dan menginspirasi banyak keluarga."
        crumbs={[{ label: 'Profil Yayasan', href: '/profil' }, { label: 'Sejarah Lembaga' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-0.5 bg-primary/10 sm:left-1/2" aria-hidden="true" />
            <ol className="space-y-10">
              {milestones.map((m, i) => (
                <Reveal as="li" key={m.year} delay={i * 60} className={`relative flex gap-6 sm:gap-10 ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}>
                  <span className="relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading text-xs font-extrabold text-gold shadow-soft ring-4 ring-cream">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`flex-1 rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift ${i % 2 === 1 ? 'sm:text-left' : ''}`}>
                    <span className="inline-block rounded-full bg-softgreen px-3.5 py-1 font-heading text-sm font-extrabold text-primary">{m.year}</span>
                    <h2 className="mt-3 font-heading text-lg font-extrabold text-primary sm:text-xl">{m.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CTASection
        title={<>Menjadi Bagian dari Perjalanan Kami</>}
        description="Daftarkan putra-putri Anda atau ambil bagian dalam mendukung program beasiswa yatim."
        primaryLabel="Daftar PPDB 2026/2027"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Dukung Program Yatim"
        secondaryTo="/yatim/donasi"
      />
    </>
  )
}
