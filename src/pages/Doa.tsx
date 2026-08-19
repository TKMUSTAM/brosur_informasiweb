import { useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import { doas } from '../data/content'

export default function Doa() {
  useSEO({
    title: 'Kumpulan Doa Harian Anak — TK Islam Al-Mustam',
    description: 'Kumpulan doa harian anak muslim lengkap dengan tulisan Arab berharakat, transliterasi latin, arti bahasa Indonesia dan keutamaannya.',
    path: '/doa',
  })

  const [active, setActive] = useState(doas[0].slug)
  const [copied, setCopied] = useState(false)
  const doa = doas.find((d) => d.slug === active) ?? doas[0]

  const copyText = () => {
    const textToCopy = `${doa.title}\n\n${doa.arabic}\n\nLatin: ${doa.latin}\nArtinya: ${doa.meaning}`
    navigator.clipboard?.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <PageHeader
        eyebrow="Khazanah Doa"
        title="Koleksi Doa Harian Santri Cilik"
        description="Doa-doa shahih sehari-hari yang mudah dihafalkan buah hati, dilengkapi harakat jelas, teks latin, dan terjemahannya."
        crumbs={[{ label: 'Konten Islami', href: '/konten-islami' }, { label: 'Doa Harian' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          
          {/* Daftar Navigasi Doa */}
          <Reveal>
            <div className="space-y-2.5">
              {doas.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setActive(d.slug)}
                  className={`flex w-full items-center gap-3.5 rounded-2xl p-4 text-left transition-all ${
                    active === d.slug
                      ? 'bg-primary text-white shadow-lift ring-2 ring-gold/40'
                      : 'border border-primary/5 bg-white text-ink shadow-soft hover:border-gold/50 hover:bg-softgreen'
                  }`}
                  aria-pressed={active === d.slug}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active === d.slug ? 'bg-white/10 text-gold' : 'bg-softgreen text-primary'}`}>
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="block font-heading text-sm font-extrabold">{d.title}</span>
                    <span className={`block text-xs ${active === d.slug ? 'text-white/70' : 'text-ink-mute'}`}>{d.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Isi Konten Doa Terpilih */}
          <Reveal delay={100}>
            <article className="rounded-3xl border border-primary/10 bg-white p-8 shadow-lift sm:p-12">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-softgreen px-4 py-1.5 text-xs font-extrabold text-primary">
                  {doa.category}
                </span>
                <button
                  type="button"
                  onClick={copyText}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/10 bg-cream px-3.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  aria-label="Salin doa"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-primary-mint" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks Doa'}</span>
                </button>
              </div>

              <h2 className="mt-5 font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                {doa.title}
              </h2>

              {/* Teks Arab */}
              <div className="mt-8 rounded-2xl bg-cream/70 p-6 sm:p-8">
                <p dir="rtl" className="text-right font-heading text-2xl font-bold leading-[2.2] text-primary sm:text-3xl">
                  {doa.arabic}
                </p>
              </div>

              {/* Transliterasi Latin */}
              <div className="mt-6 border-t border-primary/5 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Transliterasi Latin</p>
                <p className="mt-2 text-sm italic leading-relaxed text-ink font-medium">{doa.latin}</p>
              </div>

              {/* Terjemahan Bahasa Indonesia */}
              <div className="mt-5 border-t border-primary/5 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Arti / Terjemahan</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{doa.meaning}</p>
              </div>

              {/* Keutamaan Doa */}
              {doa.virtue && (
                <div className="mt-6 rounded-2xl bg-softyellow p-5 text-xs leading-relaxed text-gold-ink sm:text-sm font-medium">
                  <span className="font-bold">✨ Keutamaan &amp; Waktu Amalan:</span> {doa.virtue}
                </div>
              )}
            </article>
          </Reveal>

        </div>
      </section>
    </>
  )
}
