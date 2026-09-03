import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { quickStats, site } from '../data/site'

export default function Profil() {
  useSEO({
    title: `Tentang Kami — ${site.name}`,
    description: `Mengenal ${site.name}: Lembaga pendidikan Islam Terakreditasi A yang menaungi KB, TK A, TK B, TPA Tahfidz dan pembinaan yatim dhuafa.`,
    path: '/profil',
  })

  return (
    <>
      <PageHeader
        eyebrow="Profil Lembaga"
        title="Pendidikan Islam Unggulan Berakar Karakter Qur’ani"
        description={`${site.name} berdiri dengan tekad melahirkan generasi muslim cilik yang beradab, mencintai Al-Qur'an, mandiri, dan berwawasan luas.`}
        crumbs={[{ label: 'Profil Yayasan' }]}
      />

      {/* ===== TENTANG YAYASAN ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Foto Dokumentasi Nyata Kampus */}
            <Reveal>
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white bg-cream shadow-lift ring-1 ring-primary/10">
                  <img
                    src="/images/content/hero-school.jpg"
                    alt="Aktivitas ceria belajar siswa di TK Islam Al-Mustam"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Teks Penjelasan Profil */}
            <Reveal delay={120} className="flex flex-col gap-5">
              <SectionHeading
                align="left"
                eyebrow="Tentang Kami"
                title="Rumah Kedua yang Penuh Kasih Sayang &amp; Nilai Luhur"
                className="max-w-none"
              />
              <div className="space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                <p>
                  <strong>{site.name}</strong> didirikan sejak tahun {site.foundedYear} dengan niat tulus menghadirkan lingkungan belajar anak usia dini yang sehat, hangat, dan berstandar nasional. Kami menaungi program <strong>Kelompok Bermain (KB), Taman Kanak-kanak (TK A &amp; TK B), TPA Tahfidz Cilik</strong>, serta program beasiswa yatim piatu.
                </p>
                <p>
                  Kami meyakini bahwa pondasi keberhasilan masa depan anak berakar pada adab dan kematangan emosi di usia emas (*golden age*). Oleh karena itu, kurikulum kami memadukan <strong>Kurikulum Merdeka</strong> dengan <strong>metode sentra (BCCT)</strong> dan <strong>7 Pilar Karakter Islami</strong>, memastikan setiap potensi fitrah anak distimulasi secara optimal tanpa paksaan.
                </p>
              </div>

              {/* Keunggulan Inti */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                  <span>Rasio Guru : Siswa Nyaman (1:7)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                  <span>Metode Tilawati Tahfidz Bersanad</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                  <span>Gedung Aman &amp; Ber-AC Terpantau CCTV</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                  <span>Beasiswa Yatim &amp; Dhuafa 100% Penuh</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-3">
                <ButtonLink to="/visi-misi" variant="primary" withArrow>Visi, Misi &amp; Nilai</ButtonLink>
                <ButtonLink to="/organisasi" variant="soft">Struktur Pendidik</ButtonLink>
                <ButtonLink to="/legalitas" variant="ghost">Legalitas &amp; Akreditasi</ButtonLink>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ===== STATISTIK INSTITUSI ===== */}
      <section className="bg-primary px-4 py-14 sm:px-6" aria-label="Statistik yayasan">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 lg:grid-cols-4">
          {quickStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="rounded-2xl bg-white/5 p-6 text-center backdrop-blur-md">
                <p className="font-heading text-3xl font-extrabold text-gold sm:text-4xl">{s.value}</p>
                <p className="mt-1 font-bold text-white text-sm sm:text-base">{s.label}</p>
                <p className="mt-0.5 text-xs font-medium text-white/70">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== BUDAYA & LINGKUNGAN SEKOLAH ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Budaya sekolah">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Budaya Sekolah"
            title="Tiga Nilai Luhur yang Kami Hidupkan"
            subtitle="Menjadi panduan sikap seluruh ustadzah, staf, santri, dan wali murid."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Keteladanan & Kasih Sayang',
                desc: 'Anak meniru apa yang dilihat. Kami mendidik dengan keteladanan akhlak, tutur kata santun, dan pelukan hangat.',
              },
              {
                num: '02',
                title: 'Eksplorasi yang Menyenangkan',
                desc: 'Bermain adalah fitrah belajar anak. Kami menghadirkan media pembelajaran interaktif yang memantik daya kritis.',
              },
              {
                num: '03',
                title: 'Amanah & Transparansi',
                desc: 'Menjaga kepercayaan orang tua dan donatur melalui tata kelola terbuka dan komunikasi dua arah yang harmonis.',
              },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div>
                    <span className="font-heading text-2xl font-black text-primary/30">
                      {b.num}
                    </span>
                    <h3 className="mt-4 font-heading text-xl font-extrabold text-primary">{b.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Ingin Berkunjung dan Melihat Kampus Kami?</>}
        description="Kami mengundang ayah dan bunda untuk melihat langsung kelas, fasilitas bermain, dan berdiskusi dengan tim guru kami."
        primaryLabel="Jadwalkan Kunjungan"
        primaryTo="/kontak"
        secondaryLabel="Daftar PPDB Online"
        secondaryTo="/ppdb/daftar"
      />
    </>
  )
}
