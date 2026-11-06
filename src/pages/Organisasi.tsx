import { BadgeCheck, GraduationCap, Heart, ShieldCheck, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import CTASection from '../components/CTASection'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'

export default function Organisasi() {
  const { data } = useCMS()
  const teachers = data.teachers

  useSEO({
    title: 'Struktur Organisasi & Tenaga Pendidik | Yayasan & TK Islam Al-Mustam',
    description: 'Profil dewan pembina, kepala sekolah, guru, dan tenaga kependidikan Yayasan & TK Islam Al-Mustam.',
    path: '/organisasi',
  })

  const leader = teachers[0]
  const restTeachers = teachers.slice(1)

  return (
    <>
      <PageHeader
        eyebrow="Struktur Organisasi"
        title="Dewan Pembina, Pengurus &amp; Tenaga Pendidik"
        description="Informasi pengurus, peran, latar belakang pendidikan, dan pengalaman tenaga pendidik yang tercatat di sekolah."
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
                  {leader.avatar ? <img src={leader.avatar} alt={leader.avatarAlt || leader.name} className="mx-auto h-24 w-24 rounded-2xl object-cover" /> : <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold"><ShieldCheck className="h-8 w-8" /></div>}
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
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-7 transition-colors duration-200 hover:border-primary/35">
                  <div>
                    {o.avatar && <img src={o.avatar} alt={o.avatarAlt || o.name} className="mb-4 h-20 w-20 rounded-2xl object-cover" loading="lazy" />}
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
                </div>
              </Reveal>
            ))}
          </div>
          {teachers.length === 0 && <p className="mt-10 rounded-2xl border border-primary/10 bg-cream p-6 text-center text-sm text-ink-mute">Profil tenaga pendidik sedang diperbarui.</p>}
        </div>
      </section>

      {/* ===== KUALIFIKASI GURU TK AL-MUSTAM ===== */}
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20" aria-label="Kualifikasi guru">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="Standar Pendidik"
            title="Kompetensi &amp; Kualifikasi Tenaga Pendidik"
            subtitle="Standar pendampingan dijelaskan melalui data peran, pendidikan, dan pengalaman yang dikelola sekolah."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: 'Latar Belakang Pendidikan',
                desc: 'Profil pendidikan dan bidang keahlian setiap guru dapat dilihat pada daftar tenaga pendidik di atas.',
              },
              {
                icon: BadgeCheck,
                title: 'Pendampingan Al-Qur’an',
                desc: 'Pembelajaran Al-Qur’an disesuaikan dengan tingkat kemampuan dan tahap perkembangan anak.',
              },
              {
                icon: Heart,
                title: 'Pengembangan Kompetensi',
                desc: 'Sekolah mendorong guru mengikuti pembinaan sesuai kebutuhan pembelajaran dan perkembangan anak.',
              },
              { icon: Users, title: 'Pendampingan Kelas',
                desc: 'Pengaturan kelas mengikuti kapasitas program yang tercantum pada halaman masing-masing jenjang.',
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
