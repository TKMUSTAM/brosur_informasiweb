import { FileText, ShieldCheck, Eye, CheckCircle2, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { donationPrograms } from '../data/donations'

const GOVERNANCE_STEPS = [
  {
    title: '1. Pencatatan & Bukti Penerimaan Resmi',
    desc: 'Setiap amanah donasi atau komitmen wali asuh dicatat oleh bendahara yayasan dan diberikan tanda terima resmi.',
  },
  {
    title: '2. Verifikasi & Penetapan Penerima Manfaat',
    desc: 'Penyaluran beasiswa yatim dan dhuafa ditetapkan berdasarkan verifikasi dokumen keluarga oleh koordinator program dan kepala sekolah.',
  },
  {
    title: '3. Pelaporan Semester kepada Wali Asuh',
    desc: 'Wali asuh dan donatur tetap menerima ringkasan penggunaan dana serta perkembangan belajar anak binaan setiap akhir semester.',
  },
]

export default function Transparansi() {
  const { data } = useCMS()
  const { site } = data

  useSEO({
    title: `Tata Kelola & Transparansi Program Sosial | ${site.name}`,
    description: 'Mekanisme pencatatan, penyaluran, dan pelaporan program bantuan pendidikan yatim dan dhuafa di Yayasan Pendidikan Islam Al-Mustam.',
    path: '/yatim/transparansi',
  })

  return (
    <>
      <PageHeader
        eyebrow="Tata Kelola Amanah"
        title="Transparansi &amp; Akuntabilitas Program Pendidikan Yatim"
        description="Yayasan Pendidikan Islam Al-Mustam mengelola dana bantuan pendidikan secara tercatat dan menyampaikan laporan berkala kepada wali asuh serta donatur."
        crumbs={[{ label: 'Program Yatim', href: '/yatim' }, { label: 'Tata Kelola & Transparansi' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Alokasi Program"
            title="Empat Fokus Penyaluran Amanah Pendidikan"
            subtitle="Seluruh dana program sosial diarahkan untuk mendukung keberlangsungan belajar peserta didik yatim dan dhuafa di satuan pendidikan Al-Mustam."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {donationPrograms.map((prog, idx) => (
              <Reveal key={prog.slug} delay={idx * 70}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-6 shadow-soft">
                  <div>
                    <span className="inline-block rounded-full bg-softgreen px-3 py-1 text-xs font-extrabold text-primary">
                      Fokus {idx + 1}
                    </span>
                    <h2 className="mt-3 font-heading text-lg font-extrabold text-primary">{prog.name}</h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{prog.description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 border-t border-primary/10 pt-3 text-xs font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Tercatat di Bendahara Yayasan</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mekanisme Pelaporan */}
          <Reveal className="mt-12 rounded-3xl border border-primary/15 bg-cream p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
              Prosedur Pencatatan &amp; Pemeriksaan Berkala
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {GOVERNANCE_STEPS.map((step) => (
                <div key={step.title} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-soft">
                  <h3 className="font-heading text-base font-extrabold text-primary">{step.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{step.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pernyataan Komitmen */}
          <Reveal className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-softgreen p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-primary">
                Rekening resmi penerimaan program sosial hanya atas nama <strong>{site.bank.accountHolder}</strong> ({site.bank.bankName} {site.bank.accountNumber}).
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-white p-5">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-ink-soft">
                Dokumen rekapitulasi semester dan bukti penyaluran dapat ditinjau langsung oleh donatur melalui sekretariat yayasan.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-white p-5">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="text-sm leading-relaxed text-ink-soft">
                <p>Permohonan salinan laporan tertulis bagi wali asuh dapat diajukan melalui kontak resmi:</p>
                <a
                  href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin menanyakan informasi laporan program pendidikan yatim Yayasan Al-Mustam.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  <span>Hubungi Bendahara Yayasan</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
