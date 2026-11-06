import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { useCMS } from '../hooks/useCMS'
import { FaBookQuran, FaHeart } from 'react-icons/fa6'
import { RiCheckLine, RiArrowRightLine } from 'react-icons/ri'

export default function IslamicContentSection() {
  const { data } = useCMS()
  const doa = data.doas.find((item) => item.status !== 'DRAFT') || data.doas[0]
  const article = data.islamicArticles.find((item) => item.status !== 'DRAFT') || data.islamicArticles[0]

  return (
    <section className="bg-slate-50/60 px-4 py-20 sm:px-6 sm:py-24 border-t border-primary/10" aria-label="Khazanah Edukasi Islami">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Khazanah &amp; Pembiasaan Islami"
          title="Menanamkan Adab &amp; Mutiara Ilmu Sejak Dini"
          subtitle="Doa harian, panduan adab islami, dan artikel parenting untuk mendampingi tumbuh kembang buah hati di rumah."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Doa Hari Ini */}
          <Reveal className="h-full">
            <Link
              to="/doa"
              className="group flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-softgreen text-primary font-bold">
                    <FaBookQuran className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-softgreen px-3 py-1 text-xs font-bold text-primary">
                    Doa Harian
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-primary sm:text-xl">
                  {doa.title}
                </h3>
                <p dir="rtl" className="mt-4 text-right font-heading text-xl font-bold leading-loose text-primary">
                  {doa.arabic}
                </p>
                <p className="mt-3 text-xs italic leading-relaxed text-ink-mute">
                  "{doa.latin}"
                </p>
                <p className="mt-2 text-xs text-ink-soft leading-relaxed line-clamp-2">
                  Artinya: {doa.meaning}
                </p>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2.5 pt-4 border-t border-primary/10">
                <span>Buka Kumpulan Doa Lengkap</span>
                <RiArrowRightLine className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          {/* Card 2: 7 Pilar Adab Murid */}
          <Reveal delay={100} className="h-full">
            <Link
              to="/visi-misi"
              className="group flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-softyellow text-gold-dark font-bold">
                    <FaHeart className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-softyellow px-3 py-1 text-xs font-bold text-gold-ink">
                    Karakter Islami
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-primary sm:text-xl">
                  Pembiasaan 7 Pilar Karakter Murid
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
                  Pendidikan di TK Islam Al-Mustam membiasakan anak cinta sholat, gemar berinfaq, jujur, santun berbicara, mandiri, dan berbakti kepada orang tua.
                </p>

                <ul className="mt-4 space-y-2 text-xs font-medium text-ink-soft">
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Praktik Wudhu &amp; Sholat Berjamaah</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Hafalan Juz 'Amma Metode Menyenangkan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Adab Makan, Belajar, dan Bergaul</span>
                  </li>
                </ul>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2.5 pt-4 border-t border-primary/10">
                <span>Pelajari Pendekatan Karakter</span>
                <RiArrowRightLine className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          {/* Card 3: Artikel Parenting Edukatif */}
          <Reveal delay={200} className="h-full">
            <Link
              to="/konten-islami"
              className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-primary/15 bg-white transition-all duration-300 hover:border-primary/40 hover:shadow-soft"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.image || '/images/content/news-parenting.jpg'}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                    {article.category || 'Parenting Islami'}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-primary leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2.5 pt-3 border-t border-primary/10 w-full">
                  <span>Baca Selengkapnya</span>
                  <RiArrowRightLine className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
