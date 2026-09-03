import { useState } from 'react'
import { Clock } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { curriculumGroups, curriculumItems, sentraList, dailyRoutines } from '../data/programs'

export default function Curriculum() {
  const [activeTab, setActiveTab] = useState<'sentra' | 'routine' | 'kompetensi'>('sentra')

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24" aria-label="Kurikulum dan Pembelajaran">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-softgreen/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-10 h-96 w-96 rounded-full bg-softyellow/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Kurikulum &amp; Metode Belajar"
          title="Kurikulum Merdeka Integratif Berbasis Sentra (BCCT)"
          subtitle="Menggabungkan kerangka nasional dengan nilai-nilai diniyah, stimulasi sensori, dan pembiasaan adab harian agar anak tumbuh cerdas dan berkarakter."
        />

        {/* Tab Navigator */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-primary/10 bg-cream p-1.5 shadow-soft" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sentra'}
              onClick={() => setActiveTab('sentra')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                activeTab === 'sentra'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-ink-soft hover:text-primary'
              }`}
            >
              5 Sentra Pembelajaran
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'routine'}
              onClick={() => setActiveTab('routine')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                activeTab === 'routine'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-ink-soft hover:text-primary'
              }`}
            >
              Rutinitas Harian
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'kompetensi'}
              onClick={() => setActiveTab('kompetensi')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                activeTab === 'kompetensi'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-ink-soft hover:text-primary'
              }`}
            >
              10 Kompetensi Inti
            </button>
          </div>
        </div>

        {/* ===== Tab 1: 5 Sentra Belajar ===== */}
        {activeTab === 'sentra' && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sentraList.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-cream p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-gold/60 hover:bg-white hover:shadow-lift">
                  <div>
                    <span className="inline-block rounded-full bg-softgreen px-3 py-1 text-[11px] font-extrabold text-primary">
                      {s.badge}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-extrabold text-primary sm:text-xl">
                      {s.name}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft sm:text-sm">
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                    <span>Metode Eksplorasi Aktif</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* ===== Tab 2: Rutinitas Harian ===== */}
        {activeTab === 'routine' && (
          <div className="mt-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dailyRoutines.map((r, i) => (
                <Reveal key={r.time} delay={i * 60}>
                  <div className="flex h-full flex-col rounded-3xl border border-primary/10 bg-cream p-6 shadow-soft transition-all duration-300 hover:bg-white hover:shadow-lift">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-extrabold text-white">
                        <Clock className="h-3.5 w-3.5 text-gold" />
                        {r.time}
                      </span>
                      <span className="font-heading text-sm font-black text-primary/30">0{i + 1}</span>
                    </div>
                    <h3 className="mt-3 font-heading text-base font-extrabold text-primary">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                      {r.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* ===== Tab 3: 10 Kompetensi Inti ===== */}
        {activeTab === 'kompetensi' && (
          <div className="mt-12">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {curriculumGroups.map((g) => (
                <span key={g.title} className="inline-flex items-center rounded-full border border-primary/10 bg-cream px-4 py-2 text-xs font-bold text-primary shadow-soft sm:text-sm">
                  {g.title}
                </span>
              ))}
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {curriculumItems.map((item, i) => (
                <Reveal as="li" key={item.label} delay={i * 40} className="group flex flex-col justify-between rounded-3xl border border-primary/10 bg-cream p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-black text-primary/40">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-mint" />
                  </div>
                  <p className="mt-4 font-heading text-sm font-bold text-ink">
                    {item.label}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  )
}
