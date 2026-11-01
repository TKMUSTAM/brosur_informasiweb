import { MessageCircle } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { ButtonLink } from '../components/Buttons'
import { useCMS } from '../hooks/useCMS'

const timeline = [
  { no: '01', title: 'Isi Formulir Online', desc: 'Lengkapi data calon santri dan orang tua melalui formulir pendaftaran.' },
  { no: '02', title: 'Verifikasi WhatsApp', desc: 'Dapatkan nomor registrasi dan konfirmasi berkas ke admin resmi.' },
  { no: '03', title: 'Observasi Ramah Anak', desc: 'Sesi observasi santai bersama guru dan pemetaan gaya belajar.' },
  { no: '04', title: 'Pengumuman & Kelas', desc: 'Hasil penempatan kelompok belajar dan informasi seragam.' },
  { no: '05', title: 'Hari Pertama Belajar', desc: 'Masa Pengenalan Lingkungan Sekolah (MPLS) yang ceria.' },
]

export default function PPDBSection() {
  const { data } = useCMS()
  const { site } = data
  const ppdb = data.pageContent.ppdb
  const info = [
    { label: 'Status Pendaftaran', value: ppdb.registrationOpen ? 'Pendaftaran dibuka' : 'Pendaftaran ditutup sementara' },
    { label: 'Kelompok Usia', value: 'KB (3–4 th) • TK A (4–5 th) • TK B (5–6 th)' },
    { label: 'Informasi', value: ppdb.notice },
    { label: 'Tahun Ajaran', value: ppdb.academicYear },
  ]
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-20 sm:px-6 sm:py-24" aria-label={`PPDB ${ppdb.academicYear}`}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow={`Penerimaan Santri Baru ${ppdb.academicYear}`}
          title={ppdb.title}
          subtitle={ppdb.description}
        />

        {/* Timeline Steps */}
        <div className="relative mt-14">
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((step, i) => (
              <Reveal as="li" key={step.no} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-6 transition-colors duration-200 hover:border-primary/35">
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-heading text-xs font-black text-white shadow-soft">
                      {step.no}
                    </span>
                    <h3 className="mt-4 font-heading text-base font-extrabold text-primary">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Info Strip */}
        <Reveal className="mt-12 grid gap-4 rounded-3xl border border-primary/15 bg-softgreen p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {info.map((i) => (
            <div key={i.label} className="border-l-2 border-primary/20 pl-3.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-mute">{i.label}</p>
              <p className="mt-0.5 text-sm font-bold leading-snug text-primary">{i.value}</p>
            </div>
          ))}
        </Reveal>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {ppdb.registrationOpen && <ButtonLink to="/ppdb/daftar" variant="primary" size="lg" withArrow className="shadow-lift">Daftar Online Sekarang</ButtonLink>}
          <ButtonLink to="/ppdb" variant="outline" size="lg">
            Lihat Rincian Biaya &amp; Syarat
          </ButtonLink>
          <a
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi pendaftaran PPDB TK Islam Al-Mustam.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-bold text-primary shadow-soft transition-all hover:bg-softgreen/50"
          >
            <MessageCircle className="h-4.5 w-4.5 text-primary" />
            Chat WhatsApp PPDB
          </a>
        </div>
      </div>
    </section>
  )
}
