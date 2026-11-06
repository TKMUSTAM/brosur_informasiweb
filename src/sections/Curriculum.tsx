import { useState } from 'react'
import { FaClock } from 'react-icons/fa6'
import { RiCheckLine } from 'react-icons/ri'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { curriculumGroups, curriculumItems, sentraList, dailyRoutines } from '../data/programs'

export default function Curriculum() {
  const [activeTab, setActiveTab] = useState<'sentra' | 'routine' | 'kompetensi'>('sentra')

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24" aria-label="Kurikulum dan Pembelajaran">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Kurikulum &amp; Metode Belajar"
          title="Kurikulum Merdeka Integratif Berbasis Sentra (BCCT)"
          subtitle="Menggabungkan kerangka nasional dengan nilai diniyah, stimulasi sensori, dan pembiasaan adab harian agar anak tumbuh cerdas dan berkarakter."
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
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-cream p-6 transition-colors duration-200 hover:border-primary/35 hover:bg-white">
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
                        <FaClock className="h-3.5 w-3.5 text-gold" />
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

        {/* ===== Tab 3: 10 Kompetensi Inti (Bersih & Terstruktur tanpa Hashtag Slop) ===== */}
        {activeTab === 'kompetensi' && (
          <div className="mt-12 space-y-8">
            {/* 3 Kerangka Utama */}
            <div className="grid gap-4 sm:grid-cols-3">
              {curriculumGroups.map((g, i) => (
                <Reveal key={g.title} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-primary/15 bg-cream p-5">
                    <h4 className="font-heading text-sm sm:text-base font-bold text-primary">{g.title}</h4>
                    <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{g.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Daftar 10 Kompetensi Terpadu */}
            <div className="rounded-2xl border border-primary/15 bg-white p-6 sm:p-8 shadow-soft">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-ink-mute mb-5">
                Capaian Perkembangan Murid Usia Dini
              </h4>
              <ul className="grid gap-3.5 sm:grid-cols-2">
                {curriculumItems.map((item, i) => (
                  <Reveal as="li" key={item.label} delay={i * 30}>
                    <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-cream/50 p-3.5 transition-colors hover:bg-softgreen/50">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white mt-0.5">
                        <RiCheckLine className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-primary leading-snug">
                        {item.label}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
