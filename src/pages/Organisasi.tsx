import { BadgeCheck, GraduationCap, Heart, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'
import { organization as defaultOrg } from '../data/content'

export default function Organisasi() {
  const { data } = useCMS()
  const teachers = data.teachers.length > 0 ? data.teachers : defaultOrg

  useSEO({
    title: 'Struktur Organisasi & Tenaga Pendidik — Yayasan & TK Islam Al-Mustam',
    description: 'Profil dewan pembina, kepala sekolah, guru S1 PAUD, ustadz hafidz, dan psikolog anak di Yayasan & TK Islam Al-Mustam.',
    path: '/organisasi',
  })

  const leader = teachers[0]
  const restTeachers = teachers.slice(1)

  return (
    <>
      <PageHeader
        eyebrow="Struktur Organisasi"
        title="Dewan Pembina, Pengurus &amp; Tenaga Pendidik"
        description="Para asatidz dan pendidik berdedikasi tinggi, berlatar belakang S1 PAUD, bersertifikasi tahfidz, dan berpengalaman dalam psikologi perkembangan anak usia dini."
        crumbs={[{ label: 'Profil Yayasan', href: '/profil' }, { label: 'Struktur Organisasi' }]}
      />

      {/* ===== BAGAN PIMPINAN UTAMA ===== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Kepemimpinan Lembaga"
            title="Pimpinan Yayasan &amp; Manajemen Sekolah"
            subtitle="Menjaga integritas, visi keilmuan, dan amanah sosial yayasan."
          />

          {leader && (
            <div className="mt-12 flex justify-center">
              <Reveal className="w-full max-w-md">
                <div className="rounded-3xl border border-primary/20 bg-primary p-8 text-center text-white shadow-lift">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-gold px-3.5 py-1 text-xs font-extrabold text-primary-deep">
                    {leader.role}
                  </span>
                  <h3 className="mt-2 font-heading text-xl font-extrabold">{leader.name}</h3>
                  <p className="mt-1 text-xs text-white/80">{leader.note}</p>
                </div>
              </Reveal>
            </div>
          )}

          <div className="mx-auto h-8 w-0.5 bg-primary/20" aria-hidden="true" />

          {/* Jajaran Pengurus & Pendidik */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restTeachers.map((o, i) => (
              <Reveal key={o.role} delay={i * 70} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform duration-300 group-hover:scale-110">
                        <GraduationCap className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-extrabold text-primary">
                        {o.role}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-base font-extrabold text-primary sm:text-lg">
                      {o.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-ink-mute">{o.note}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 border-t border-primary/5 pt-4 text-xs font-bold text-primary-mint">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Tenaga Ahli Bersertifikasi</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KUALIFIKASI GURU TK AL-MUSTAM ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Kualifikasi guru">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Standar Pendidik"
            title="Kompetensi &amp; Kualifikasi Tenaga Pendidik"
            subtitle="Kami memastikan ananda didampingi oleh figur guru yang memiliki integritas keilmuan dan keteladanan akhlak."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: '100% Sarjana (S1/S2)',
                desc: 'Lulusan perguruan tinggi terakreditasi jurusan PG-PAUD, Tarbiyah Islamiyah, dan Psikologi.',
              },
              {
                icon: BadgeCheck,
                title: 'Hafidzah & Bersertifikat',
                desc: 'Pengajar Al-Qur’an bersyahadah metode Tilawati/Ummi dengan makhraj fasih.',
              },
              {
                icon: Heart,
                title: 'Pelatihan Keibuan & Parenting',
                desc: 'Mendapat pembinaan rutin terkait psikologi perkembangan anak usia dini dan *positive discipline*.',
              },
              {
                icon: Sparkles,
                title: 'Rasio Pendampingan 1:7',
                desc: 'Setiap kelas didampingi 2 guru utama untuk memastikan perhatian penuh pada setiap anak.',
              },
            ].map((k, i) => (
              <Reveal key={k.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary">
                    <k.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-extrabold text-primary">{k.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{k.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Ingin Berkonsultasi dengan Tim Guru Kami?</>}
        description="Jadwalkan sesi konsultasi tumbuh kembang anak bersama psikolog dan kepala sekolah kami."
        primaryLabel="Hubungi Sekretariat"
        primaryTo="/kontak"
        secondaryLabel="Daftar PPDB Online"
        secondaryTo="/ppdb/daftar"
      />
    </>
  )
}
