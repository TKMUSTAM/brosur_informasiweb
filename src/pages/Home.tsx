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
import TestimonialsSection from '../sections/TestimonialsSection'
import CTASection from '../components/CTASection'
import { site } from '../data/site'

export default function Home() {
  useSEO({
    title: `${site.name} — Membentuk Generasi Qur’ani, Beradab & Cerdas Holistik`,
    description:
      'Lembaga Pendidikan Islam Terakreditasi A: Playgroup (KB), TK A, TK B, TPA Tahfidz, serta program beasiswa penuh yatim piatu. Daftarkan buah hati Anda sekarang.',
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
      <TestimonialsSection />
      <CTASection
        title={
          <>
            Mari Bentuk Generasi <span className="text-gold">Qur’ani &amp; Berakhlaqul Karimah.</span>
          </>
        }
        description="Amankan kursi pendaftaran putra-putri Anda untuk Tahun Ajaran 2026/2027 atau dukung beasiswa anak yatim."
        primaryLabel="Daftar PPDB Online"
        primaryTo="/ppdb/daftar"
        secondaryLabel="Konsultasi WhatsApp"
        secondaryTo={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi pendaftaran di TK Islam Al-Mustam.')}`}
      />
    </>
  )
}
