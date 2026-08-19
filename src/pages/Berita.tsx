import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import NewsCard from '../components/cards/NewsCard'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { newsCategories } from '../data/news'

export default function Berita() {
  const { data } = useCMS()
  const news = data.news

  useSEO({
    title: 'Berita & Kegiatan',
    description: 'Berita dan kegiatan terbaru Yayasan Mustam: pendidikan, kajian, PHBI, kegiatan anak, sosial, dan yatim.',
    path: '/berita',
  })

  const [category, setCategory] = useState('Semua')
  const filtered = category === 'Semua' ? news : news.filter((n) => n.category === category)

  return (
    <>
      <PageHeader
        eyebrow="Berita & Kegiatan"
        title="Kabar Terbaru dari Yayasan"
        description="Ikuti perkembangan dan momen berharga dari keluarga besar Yayasan Mustam."
        crumbs={[{ label: 'Berita & Kegiatan' }]}
      />

      <section aria-label="Daftar berita" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="sr-only">Daftar Berita</h2>
          {/* filter kategori */}
          <Reveal>
            <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:flex-wrap">
              {newsCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                    category === c ? 'bg-primary text-white shadow-soft' : 'bg-white text-ink-soft shadow-soft hover:bg-softgreen'
                  }`}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-ink-mute">Belum ada berita pada kategori ini.</p>
          )}
        </div>
      </section>
    </>
  )
}
