import PageHeader from '../components/PageHeader'
import ProgramCard from '../components/cards/ProgramCard'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { programs as defaultPrograms } from '../data/programs'

export default function Program() {
  const { data } = useCMS()
  const programs = data.programs.length > 0 ? data.programs : defaultPrograms

  useSEO({
    title: 'Program Pendidikan',
    description: 'Program pendidikan Yayasan Mustam: TPA, KB, TK A, dan TK B dengan Kurikulum Merdeka dan muatan diniyah.',
    path: '/program',
  })

  return (
    <>
      <PageHeader
        eyebrow="Program Pendidikan"
        title="Program Belajar Sesuai Tahap Tumbuh Kembang Anak"
        description="Setiap jenjang dirancang khusus sesuai kebutuhan usia, dengan pendekatan bermain, kasih sayang, dan pembiasaan Islami."
        crumbs={[{ label: 'Program Pendidikan' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="sr-only">Program Pendidikan Kami</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {programs.map((p, i) => (
              <ProgramCard key={p.slug} program={p} index={i} />
            ))}
          </div>

          {/* catatan */}
          <div className="mt-12 grid gap-6 rounded-card-lg bg-softgreen p-8 sm:p-10 lg:grid-cols-3">
            {[
              { title: 'Rasio Guru Ideal', desc: 'Setiap kelas didampingi 1–2 guru dengan rasio anak yang terkontrol.' },
              { title: 'Keamanan Terjaga', desc: 'Kawasan sekolah berpagar, tamu terdata, dan area bermain terpantau.' },
              { title: 'Pembiasaan Islami', desc: 'Doa, sholat, adab, dan hafalan menjadi rutinitas harian yang menyenangkan.' },
            ].map((c) => (
              <div key={c.title}>
                <h3 className="font-heading text-base font-extrabold text-primary">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title={<>Bingung Memilih Program yang Tepat?</>} description="Konsultasikan kebutuhan buah hati Anda dengan tim kami secara gratis." />
    </>
  )
}
