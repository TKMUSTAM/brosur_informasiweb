import { useSEO } from '../hooks/useSEO'
import Hero from '../sections/Hero'
import ProgramsSection from '../sections/ProgramsSection'
import PPDBSection from '../sections/PPDBSection'
import WelcomeSection from '../sections/WelcomeSection'
import CTASection from '../components/CTASection'
import { useCMS } from '../hooks/useCMS'

export default function Home() {
  const { data } = useCMS()
  const { site } = data
  useSEO({
    title: `${site.name} | Informasi Sekolah dan PPDB`,
    description:
      'Informasi program pendidikan dan pendaftaran peserta didik baru TK Islam Al-Mustam.',
    path: '/',
  })

  return (
    <>
      <Hero />
      <ProgramsSection />
      <PPDBSection />
      <WelcomeSection />
      <CTASection
        title={
          <>
            Mari Bentuk Generasi <span className="text-gold">Qur’ani &amp; Berakhlaqul Karimah.</span>
          </>
        }
        description={`Tanyakan ketersediaan kuota PPDB Tahun Ajaran ${data.pageContent.ppdb.academicYear} melalui kanal resmi sekolah.`}
        primaryLabel="Daftar PPDB Online"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Konsultasi WhatsApp"
        secondaryTo={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi pendaftaran di TK Islam Al-Mustam.')}`}
      />
    </>
  )
}
