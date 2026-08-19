import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import NewsCard from '../components/cards/NewsCard'
import { ButtonLink } from '../components/Buttons'
import ContentImage from '../components/illustrations/ContentImage'
import { news } from '../data/news'
import { sceneForNewsSlug } from '../lib/scenes'

export default function NewsSection() {
  const featured = news.find((n) => n.featured) ?? news[0]
  const rest = news.filter((n) => n.slug !== featured.slug).slice(0, 3)

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24" aria-label="Berita dan kegiatan">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Berita & Kegiatan"
            title="Berita & Kegiatan Terbaru"
            subtitle="Ikuti perkembangan, momen, dan kabar terbaru dari Yayasan Mustam."
            className="sm:max-w-xl"
          />
          <ButtonLink to="/berita" variant="soft" withArrow className="shrink-0">
            Semua Berita
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* featured besar */}
          <Link
            to={`/berita/${featured.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift md:col-span-2 lg:row-span-2"
            aria-label={featured.title}
          >
            <div className="relative overflow-hidden">
              <ContentImage
                image={featured.image}
                scene={sceneForNewsSlug(featured.slug)}
                palette={featured.color}
                alt={featured.title}
                className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-105 lg:aspect-[16/10]"
              />
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3.5 py-1.5 text-xs font-extrabold text-primary shadow-soft">
                {featured.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-7">
              <span className="text-xs font-semibold text-ink-mute">{featured.date}</span>
              <h3 className="font-heading text-2xl font-extrabold leading-snug text-primary">{featured.title}</h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{featured.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-bold text-primary transition-all group-hover:gap-3">
                Baca Selengkapnya
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {rest.map((n) => (
            <NewsCard key={n.slug} item={n} />
          ))}
        </div>
      </div>
    </section>
  )
}
