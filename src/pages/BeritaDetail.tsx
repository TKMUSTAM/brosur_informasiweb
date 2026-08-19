import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Tag } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentImage from '../components/illustrations/ContentImage'
import NewsCard from '../components/cards/NewsCard'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { news } from '../data/news'
import { sceneForNewsSlug } from '../lib/scenes'

export default function BeritaDetail() {
  const { slug } = useParams()
  const item = news.find((n) => n.slug === slug)

  useSEO({
    title: item ? item.title : 'Berita',
    description: item?.excerpt ?? '',
    path: `/berita/${slug}`,
  })

  if (!item) return <Navigate to="/berita" replace />

  const related = news.filter((n) => n.slug !== item.slug).slice(0, 3)

  return (
    <>
      <PageHeader
        eyebrow={item.category}
        title={item.title}
        crumbs={[{ label: 'Berita & Kegiatan', href: '/berita' }, { label: item.category }]}
      >
        <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-gold" /> {item.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-gold" /> {item.category}
          </span>
        </p>
      </PageHeader>

      <article className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="overflow-hidden rounded-card shadow-lift">
            <ContentImage
              image={item.image}
              scene={sceneForNewsSlug(item.slug)}
              palette={item.color}
              alt={item.title}
              className="aspect-[16/9] w-full"
            />
          </Reveal>

          <div className="mt-10 space-y-5">
            {item.content.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="text-[15px] leading-relaxed text-ink-soft sm:text-base">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-primary/5 pt-7">
            <Link to="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3">
              <ArrowLeft className="h-4 w-4" /> Semua Berita
            </Link>
            <Link to="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-primary">
              Berikutnya <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>

      <section className="bg-cream px-4 py-16 sm:px-6" aria-label="Berita terkait">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-center font-heading text-2xl font-extrabold text-primary sm:text-3xl">Berita Lainnya</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>
        </div>
      </section>

      <CTASection title={<>Ikuti Perkembangan Kami</>} />
    </>
  )
}
