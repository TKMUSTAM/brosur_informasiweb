import { ShieldCheck, Video, Wind, Sparkles, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { fasilitas as defaultFasilitas } from '../data/content'

const safetyStandards = [
  { icon: Video, title: 'CCTV 24 Jam Terpadu', desc: 'Kamera pengawas di setiap sudut kelas, lorong, dan area bermain luar.' },
  { icon: Wind, title: 'Sirkulasi Udara & AC Bersih', desc: 'Ruang kelas sejuk dengan filter udara rutin dibersihkan dan pencahayaan matahari.' },
  { icon: ShieldCheck, title: 'Soft Flooring & P3K Ramah Balita', desc: 'Lantai karet peredam benturan di area playground serta perlengkapan P3K anak.' },
  { icon: Sparkles, title: 'Standar Kebersihan & Sanitasi', desc: 'Pembersihan dan disinfeksi mainan dan alat peraga edukatif setiap hari.' },
]

export default function Fasilitas() {
  const { data } = useCMS()
  const site = data.site
  const fasilitas = data.facilities.length > 0 ? data.facilities : defaultFasilitas
  useSEO({
    title: 'Fasilitas Kampus Ramah Anak — TK Islam Al-Mustam',
    description: 'Fasilitas belajar yang nyaman, aman, ber-AC, terpantau CCTV 24 jam dan mendukung tumbuh kembang anak di TK Islam Al-Mustam.',
    path: '/fasilitas',
  })

  return (
    <>
      <PageHeader
        eyebrow="Fasilitas Kampus"
        title="Lingkungan Belajar yang Aman, Asri &amp; Ramah Anak"
        description="Setiap ruangan dan sarana bermain dirancang khusus dengan standar keamanan dan ergonomi anak usia dini, menciptakan suasana nyaman laksana di rumah sendiri."
        crumbs={[{ label: 'Profil Yayasan', href: '/profil' }, { label: 'Fasilitas Kampus' }]}
      />

      {/* ===== DAFTAR FASILITAS UTAMA ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Sarana Prasarana"
            title="Fasilitas Lengkap Berstandar Pendidikan Nasional"
            subtitle="Mendukung kegiatan belajar di dalam ruangan (*indoor*) maupun eksplorasi alam luar ruang (*outdoor*)."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/60 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-softgreen text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-gold">
                        <Icon name={f.icon} className="h-7 w-7" />
                      </span>
                      <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold text-primary">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-extrabold text-primary">{f.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-primary/5 pt-4 text-xs font-bold text-primary-mint">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Terawat &amp; Higienis</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STANDAR KESEHATAN & KEAMANAN ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Standar keamanan">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Keamanan Terjamin"
            title="Protokol Keamanan &amp; Kesehatan Anak"
            subtitle="Prioritas tertinggi kami adalah memastikan ananda belajar dalam lingkungan yang terlindungi sepenuhnya."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {safetyStandards.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-gold">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-extrabold text-primary">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UNDANGAN VISIT KAMPUS ===== */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal className="rounded-3xl border border-primary/10 bg-primary p-8 text-center text-white shadow-lift sm:p-12">
            <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
              Ingin Merasakan Langsung Suasana Kampus Kami?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Kami menyambut hangat kehadiran ayah dan bunda beserta ananda untuk berkeliling melihat kelas, area bermain, dan berkonsultasi dengan kepala sekolah kami.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink to="/kontak" variant="gold" size="lg" withArrow className="shadow-gold">
                Jadwalkan Kunjungan Sekolah
              </ButtonLink>
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin menjadwalkan kunjungan (school tour) ke TK Islam Al-Mustam.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Chat WhatsApp Admin
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection title={<>Fasilitas Terbaik untuk Tumbuh Kembang Buah Hati</>} />
    </>
  )
}
