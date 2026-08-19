import { GraduationCap, Utensils, HeartHandshake, Calendar, ShieldCheck, CheckCircle2, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { site } from '../data/site'

const programs = [
  {
    icon: GraduationCap,
    title: 'Beasiswa Pendidikan 100%',
    desc: 'Membiayai penuh seluruh kebutuhan sekolah anak yatim: SPP bulanan, uang pangkal, 4 setel seragam, dan buku sentra pembelajaran.',
  },
  {
    icon: Utensils,
    title: 'Snack & Nutrisi Sehat Harian',
    desc: 'Memastikan asupan gizi seimbang melalui menu snack higienis dan susu setiap hari belajar di sekolah.',
  },
  {
    icon: HeartHandshake,
    title: 'Pendampingan Psikologis & Karakter',
    desc: 'Pemantauan perkembangan emosional dan pembinaan karakter Qur’ani oleh ustadzah dan psikolog anak berlisensi.',
  },
  {
    icon: Calendar,
    title: 'Santunan & Kebahagiaan PHBI',
    desc: 'Bingkisan hari raya Idul Fitri, santunan 10 Muharram, dan kegiatan ceria bersama keluarga besar yayasan.',
  },
]

const stats = [
  { value: '35+', label: 'Santri Yatim Aktif' },
  { value: '100%', label: 'Bebas Biaya Sekolah' },
  { value: '12', label: 'Tenaga Pengajar Peduli' },
  { value: '7', label: 'Pilar Karakter Diniyah' },
]

export default function Yatim() {
  useSEO({
    title: `Program Beasiswa Yatim & Dhuafa — ${site.name}`,
    description: `Program pembinaan dan beasiswa penuh 100% bebas biaya pendidikan untuk anak yatim piatu di ${site.name}.`,
    path: '/yatim',
  })

  return (
    <>
      <PageHeader
        eyebrow="Kepedulian Sosial"
        title="Program Beasiswa &amp; Pembinaan Santri Yatim"
        description="Setiap anak berhak mendapatkan kesempatan belajar di lingkungan terbaik, tumbuh dengan kasih sayang, dan menatap masa depan cerah."
        crumbs={[{ label: 'Program Yatim' }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/yatim/orangtua-asuh" variant="gold" withArrow className="shadow-lift">
            Program Orang Tua Asuh
          </ButtonLink>
          <a
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin mendaftarkan anak yatim / bertanya tentang program beasiswa di TK Islam Al-Mustam.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
          >
            <Phone className="h-4 w-4 text-gold" />
            <span>Hubungi Sekretariat</span>
          </a>
        </div>
      </PageHeader>

      {/* STATISTIK PROGRAM */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col justify-center rounded-3xl border border-primary/10 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift">
                <p className="font-heading text-3xl font-black text-primary">{s.value}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-ink-mute">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 PILAR LAYANAN BINAAN */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Layanan program yatim">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Bentuk Pembinaan"
            title="Dukungan Holistik: Ilmu, Karakter, &amp; Masa Depan"
            subtitle="Kami mendampingi santri yatim secara menyeluruh untuk memastikan tumbuh kembang optimal dan mandiri."
          />
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform duration-300 group-hover:scale-110">
                      <p.icon className="h-7 w-7" />
                    </span>
                    <h3 className="font-heading text-lg font-extrabold text-primary">{p.title}</h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft sm:text-sm">{p.desc}</p>
                  </div>
                  
                  <div className="mt-5 flex items-center gap-1.5 border-t border-primary/5 pt-4 text-xs font-bold text-primary-mint">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Layanan Rutin</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HADITS & KOMITMEN AMANAH */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Foto Kelas & Santri */}
            <Reveal className="overflow-hidden rounded-3xl border border-primary/10 bg-cream p-3 shadow-lift">
              <img
                src="/images/content/prog-tk-a.jpg"
                alt="Santri yatim belajar di TK Islam Al-Mustam"
                loading="lazy"
                className="h-full w-full rounded-2xl object-cover"
              />
            </Reveal>

            {/* Narasi Komitmen */}
            <Reveal delay={100} className="flex flex-col gap-6">
              <span className="inline-block rounded-full bg-softgreen px-4 py-1.5 text-xs font-extrabold text-primary w-fit">
                Amanah Mulia Nabawi
              </span>
              
              <h2 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl lg:text-4xl">
                Memuliakan Anak Yatim, Meraih Keberkahan Bersama
              </h2>
              
              <blockquote className="rounded-2xl border-l-4 border-gold bg-cream p-5 text-sm italic leading-relaxed text-ink font-medium">
                “Aku dan orang yang menanggung anak yatim akan berada di surga seperti ini,” seraya beliau ﷺ mengisyaratkan jari telunjuk dan jari tengahnya.
                <span className="mt-2 block text-xs not-italic font-bold text-primary">— Hadits Riwayat Imam Bukhari</span>
              </blockquote>
              
              <p className="text-sm leading-relaxed text-ink-soft">
                Yayasan &amp; TK Islam Al-Mustam berkomitmen membuka pintu seluas-luasnya bagi anak-anak yatim dhuafa untuk mengenyam pendidikan berkualitas tinggi tanpa kendala biaya sedikitpun.
              </p>

              <div className="flex items-center gap-3 rounded-2xl bg-softgreen p-4 text-xs font-bold text-primary sm:text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                <span>Seluruh penerima beasiswa terverifikasi langsung oleh tim sosial yayasan.</span>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      <CTASection
        title={<>Konsultasikan Program Kemitraan Peduli Yatim</>}
        description="Hubungi sekretariat yayasan untuk informasi pendaftaran beasiswa santri yatim atau program wali asuh."
        primaryLabel="Konsultasi WhatsApp"
        primaryTo={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin konsultasi program santri yatim di TK Islam Al-Mustam.')}`}
        secondaryLabel="Program Orang Tua Asuh"
        secondaryTo="/yatim/orangtua-asuh"
      />
    </>
  )
}
