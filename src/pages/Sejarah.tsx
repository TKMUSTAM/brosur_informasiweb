import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { site } from '../data/site'
import { useCMS } from '../hooks/useCMS'

const defaultMilestones = [
  {
    year: '2012',
    title: 'Awal Mula: Majelis Taklim & TPQ Kecil',
    desc: 'Bermula dari majelis taklim dan TPQ kecil dengan 15 murid, semangat mengajarkan baca-tulis Al-Qur’an dan adab kepada anak-anak sekitar mulai bersemi.',
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
    title: 'Pengembangan Program Dukungan Pendidikan',
    desc: 'Yayasan mulai mengembangkan jalur bantuan pendidikan bagi anak yatim dan keluarga yang membutuhkan.',
  },
  {
    year: '2026',
    title: 'Penguatan Mutu dan Layanan Pendidikan',
    desc: 'Sekolah melanjutkan pengembangan program, tata kelola, dan layanan informasi bagi keluarga.',
  },
]

export default function Sejarah() {
  const { data } = useCMS()
  const milestones = data.pageContent.sejarah?.milestones || defaultMilestones

  useSEO({
    title: `Sejarah & Perjalanan | ${site.name}`,
    description: `Perjalanan ${site.name} dari majelis taklim kecil hingga menjadi yayasan pendidikan Islam modern terakreditasi A.`,
    path: '/sejarah',
  })

  return (
    <>
      <PageHeader
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
                <Reveal as="li" key={m.year} delay={i * 80}>
                  <div className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${i % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gold font-heading text-xs font-black text-primary shadow-soft sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                      {m.year.slice(2)}
                    </div>
                    <div className="ml-14 sm:ml-0 sm:w-[calc(50%-2rem)]">
                      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lift">
                        <span className="font-heading text-xs font-extrabold text-gold-dark">{m.year}</span>
                        <h3 className="mt-1 font-heading text-base font-extrabold text-primary">{m.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CTASection
        title={<>Menjadi Bagian dari Jejak Kebaikan Ini</>}
        description="Daftarkan ananda atau berkontribusi dalam program beasiswa yatim untuk generasi yang lebih baik."
        primaryLabel="Daftar PPDB Online"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Program Orang Tua Asuh"
        secondaryTo="/yatim/orangtua-asuh"
      />
    </>
  )
}
