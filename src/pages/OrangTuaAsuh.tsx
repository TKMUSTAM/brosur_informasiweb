import { Users, MessageCircle, Heart, Share2, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { ButtonAnchor } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { site } from '../data/site'

const steps = [
  { icon: Users, title: '1. Konsultasi Kebutuhan', desc: 'Hubungi sekretariat yayasan untuk mendapatkan informasi anak yatim binaan yang membutuhkan wali asuh.' },
  { icon: MessageCircle, title: '2. Kesepakatan Program', desc: 'Menentukan program pendampingan pendidikan bulanan yang selaras dengan rencana Anda.' },
  { icon: Heart, title: '3. Menjadi Wali Asuh', desc: 'Menjadi keluarga asuh yang mendampingi pemenuhan SPP, gizi, dan pendidikan karakter anak.' },
  { icon: Share2, title: '4. Laporan Perkembangan', desc: 'Menerima laporan akademik dan tumbuh kembang anak secara berkala setiap semester.' },
]

const benefits = [
  'Laporan perkembangan belajar anak setiap akhir semester',
  'Kabar dan foto dokumentasi kegiatan santri di sekolah',
  'Undangan khusus acara silaturahmi tahunan keluarga yayasan',
  'Sertifikat apresiasi wali asuh dari pimpinan yayasan',
  'Doa tulus dari santri-santri cilik Al-Mustam setiap hari',
  'Pendampingan berkelanjutan hingga anak siap melanjutkan ke jenjang SD',
]

export default function OrangTuaAsuh() {
  useSEO({
    title: `Program Orang Tua Asuh — ${site.name}`,
    description: 'Program orang tua asuh: dukung pendidikan dan tumbuh kembang anak yatim secara berkelanjutan.',
    path: '/yatim/orangtua-asuh',
  })

  return (
    <>
      <PageHeader
        eyebrow="Kepedulian Santri Yatim"
        title="Program Orang Tua Asuh — Menjadi Pelita Harapan"
        description="Melalui program wali asuh, Anda ikut membiayai kelangsungan pendidikan, pemenuhan gizi, dan masa depan seorang santri yatim."
        crumbs={[{ label: 'Program Yatim', href: '/yatim' }, { label: 'Orang Tua Asuh' }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonAnchor
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin mendaftar menjadi orang tua asuh di TK Islam Al-Mustam.')}`}
            target="_blank"
            rel="noreferrer"
            variant="gold"
            className="shadow-lift"
          >
            Konsultasi Wali Asuh via WhatsApp
          </ButtonAnchor>
        </div>
      </PageHeader>

      {/* 4 TAHAPAN */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Tahapan menjadi orang tua asuh">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Alur Bergabung"
            title="Empat Langkah Mudah Menjadi Wali Asuh"
            subtitle="Mekanisme terstruktur dan terverifikasi untuk memastikan kebaikan Anda tersalurkan dengan tepat sasaran."
          />
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90} className="h-full">
                <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="h-7 w-7" />
                    </span>
                    <h3 className="font-heading text-base font-extrabold text-primary sm:text-lg">{s.title}</h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft sm:text-sm">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MANFAAT WALI ASUH */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Manfaat program orang tua asuh">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            <Reveal className="overflow-hidden rounded-3xl border border-primary/10 bg-white p-3 shadow-lift">
              <img
                src="/images/content/prog-tpa.jpg"
                alt="Santri cilik binaan TK Islam Al-Mustam"
                loading="lazy"
                className="h-full w-full rounded-2xl object-cover"
              />
            </Reveal>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Transparansi &amp; Laporan"
                title="Keterlibatan yang Bermakna &amp; Terpantau"
                subtitle="Kami menjaga amanah dengan memberikan laporan perkembangan berkala kepada setiap wali asuh."
                className="max-w-none"
              />
              
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {benefits.map((b, i) => (
                  <Reveal as="li" key={b} delay={i * 50} className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-soft">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-mint" />
                    <span className="text-xs font-bold leading-relaxed text-ink sm:text-sm">{b}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <CTASection
        title={<>Mari Bersama Membuka Pintu Surga</>}
        description="Satu uluran tangan Anda adalah pelita besar bagi masa depan santri yatim Al-Mustam."
        primaryLabel="Daftar Wali Asuh via WhatsApp"
        primaryTo={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin mendaftar menjadi orang tua asuh santri yatim.')}`}
        secondaryLabel="Hubungi Kontak"
        secondaryTo="/kontak"
      />
    </>
  )
}
