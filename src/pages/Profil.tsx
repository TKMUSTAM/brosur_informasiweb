import { Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { ButtonLink } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'

export default function Profil() {
  const { data } = useCMS()
  const site = data.site
  const profile = data.pageContent.profile || {
    title: 'Pendidikan Islam Unggulan Berakar Karakter Qur’ani',
    description: `${site.name} berdiri dengan tekad melahirkan generasi muslim cilik yang beradab, mencintai Al-Qur'an, mandiri, dan berwawasan luas.`,
    aboutParagraph1: `${site.name} didirikan sejak tahun ${site.foundedYear} dengan niat tulus menghadirkan lingkungan belajar anak usia dini yang sehat, hangat, dan berstandar nasional. Kami menaungi program Kelompok Bermain (KB), Taman Kanak-kanak (TK A & TK B), TPA Tahfidz Cilik, serta program beasiswa yatim piatu.`,
    aboutParagraph2: 'Kami meyakini bahwa pondasi keberhasilan masa depan anak berakar pada adab dan kematangan emosi di usia emas (golden age). Oleh karena itu, kurikulum kami memadukan Kurikulum Merdeka dengan metode sentra (BCCT) dan 7 Pilar Karakter Islami, memastikan setiap potensi fitrah anak distimulasi secara optimal tanpa paksaan.',
    image: '/images/content/hero-school.jpg',
    imageAlt: 'Gedung TK Islam Al-Mustam',
  }

  useSEO({
    title: `Tentang Kami | ${site.name}`,
    description: `Mengenal ${site.name}: Lembaga pendidikan Islam Terakreditasi A yang menaungi KB, TK A, TK B, TPA Tahfidz dan pembinaan yatim dhuafa.`,
    path: '/profil',
  })

  return (
    <>
      <PageHeader
        title={profile.title}
        description={profile.description}
        crumbs={[{ label: 'Profil Yayasan' }]}
      />

      {/* ===== TENTANG YAYASAN ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Foto Dokumentasi Nyata Kampus */}
            <Reveal className="overflow-hidden rounded-3xl border border-primary/10 bg-white p-3 shadow-lift">
              <img
                src={profile.image}
                alt={profile.imageAlt || 'Gedung TK Islam Al-Mustam'}
                width="720"
                height="540"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </Reveal>

            {/* Narasi Sejarah & Nilai */}
            <Reveal delay={100} className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Sejarah &amp; Dedikasi"
                title="Membangun Fitrah Anak Sejak Usia Dini"
              />
              <div className="space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                <p>{profile.aboutParagraph1}</p>
                <p>{profile.aboutParagraph2}</p>
              </div>

              {/* Keunggulan Inti */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Kapasitas kelas tercantum per program</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Pembelajaran Al-Qur’an bertahap</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Informasi fasilitas dapat diperiksa langsung</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Jalur pengajuan bantuan pendidikan</span>
                </div>
              </div>

              <div className="pt-2">
                <ButtonLink to="/ppdb/daftar" variant="primary" size="lg" withArrow>
                  Pendaftaran Murid Baru
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== IDENTITAS SINGKAT ===== */}
      <section className="border-t border-primary/10 bg-cream px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            align="center"
            eyebrow="Landasan Operasional"
            title="Karakteristik &amp; Komitmen Pelayanan"
            subtitle="Prinsip tata kelola dan pendidikan yang diterapkan secara konsisten dalam operasional harian sekolah."
            className="mb-14"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
              <p className="font-heading text-3xl font-extrabold text-gold-dark">{site.foundedYear}</p>
              <h3 className="mt-2 font-heading text-base font-extrabold text-primary">Tahun Berdiri</h3>
              <p className="mt-1.5 text-xs text-ink-soft">Konsisten melayani pendidikan anak usia dini dengan dasar nilai Islam.</p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
              <p className="font-heading text-3xl font-extrabold text-primary">{site.accreditation}</p>
              <h3 className="mt-2 font-heading text-base font-extrabold text-primary">Akreditasi</h3>
              <p className="mt-1.5 text-xs text-ink-soft">Pengakuan standar kelayakan penyelenggaraan PAUD dari BAN PDM.</p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
              <p className="font-heading text-3xl font-extrabold text-gold-dark">1:15</p>
              <h3 className="mt-2 font-heading text-base font-extrabold text-primary">Rasio Guru &amp; Anak</h3>
              <p className="mt-1.5 text-xs text-ink-soft">Pendampingan optimal dengan kapasitas kelas terbatas per jenjang.</p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
              <p className="font-heading text-3xl font-extrabold text-primary">100%</p>
              <h3 className="mt-2 font-heading text-base font-extrabold text-primary">Beasiswa Yatim</h3>
              <p className="mt-1.5 text-xs text-ink-soft">Didanai langsung dari amanah infak dan sedekah yayasan.</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={<>Kenali Lingkungan Belajar Kami Secara Langsung</>}
        description="Jadwalkan kunjungan sekolah untuk melihat fasilitas, suasana sentra, dan berkonsultasi langsung dengan ustadzah."
        primaryLabel="Jadwalkan Kunjungan"
        primaryTo="/kontak"
        secondaryLabel="Daftar PPDB Online"
        secondaryTo="/ppdb/daftar"
      />
    </>
  )
}
