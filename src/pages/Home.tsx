import { useSEO } from '../hooks/useSEO'
import Hero from '../sections/Hero'
import IslamicInfoBar from '../components/IslamicInfoBar'
import Pillars from '../sections/Pillars'
import ProgramsSection from '../sections/ProgramsSection'
import Curriculum from '../sections/Curriculum'
import YatimSection from '../sections/YatimSection'
import PPDBSection from '../sections/PPDBSection'
import WelcomeSection from '../sections/WelcomeSection'
import NewsSection from '../sections/NewsSection'
import GallerySection from '../sections/GallerySection'
import IslamicContentSection from '../sections/IslamicContentSection'
import CTASection from '../components/CTASection'
import { useCMS } from '../hooks/useCMS'

export default function Home() {
  const { data } = useCMS()
  const { site } = data
  useSEO({
    title: `${site.name} | Membentuk Generasi Qur’ani, Beradab & Cerdas Holistik`,
    description:
      'Informasi program Playgroup (KB), TK A, TK B, TPA Tahfidz, kegiatan sekolah, PPDB, serta bantuan pendidikan yatim dan dhuafa di Yayasan Al-Mustam.',
    path: '/',
  })

  return (
    <>
      <Hero />
      <IslamicInfoBar />
      <Pillars />
      <ProgramsSection />
      <Curriculum />
      <YatimSection />
      <PPDBSection />
      <WelcomeSection />
      <NewsSection />
      <GallerySection />
      <IslamicContentSection />
      <CTASection
        title={
          <>
            Mari Bersilaturahmi &amp; Kenali Lebih Dekat <span className="text-gold">TK Islam Al-Mustam.</span>
          </>
        }
        description={`Kunjungi lingkungan belajar kami, amati interaksi guru ramah anak, dan konsultasikan tumbuh kembang buah hati Anda.`}
        primaryLabel="Hubungi Kontak Sekolah"
        primaryTo="/kontak"
        secondaryLabel="Portal PPDB Online"
        secondaryTo="/ppdb/daftar"
      />
    </>
  )
}
