import { useState } from 'react'
import { Image, Save, School, ScrollText, Building2, Target, History } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { PageContent, PPDBWave } from '../../../types/cms'
import ImageUploadField from './ImageUploadField'

const inputClass = 'w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'

export default function PageContentManagementTab() {
  const { data, updatePageContent } = useCMS()
  const [activeSubTab, setActiveSubTab] = useState<'beranda' | 'profil' | 'visimisi' | 'sejarah' | 'ppdb'>('beranda')

  // Local state for each section
  const [hero, setHero] = useState<PageContent['hero']>(data.pageContent.hero)
  const [welcome, setWelcome] = useState<PageContent['welcome']>(data.pageContent.welcome)
  const [ppdb, setPpdb] = useState<PageContent['ppdb']>(() => {
    const p = data.pageContent.ppdb;
    const defaultWaves: PPDBWave[] = [
      {
        id: 'gelombang-1',
        name: 'Gelombang 1 (Early Bird & Beasiswa Yatim)',
        period: '1 Januari – 30 April 2026',
        quota: 'Sisa 8 Kuota',
        status: 'OPEN',
        description: 'Potongan biaya sarana pendidikan & prioritas pemilihan shift kelas.',
      },
      {
        id: 'gelombang-2',
        name: 'Gelombang 2 (Reguler)',
        period: '1 Mei – 10 Juli 2026',
        quota: '30 Kuota Tersedia',
        status: 'UPCOMING',
        description: 'Penerimaan siswa reguler untuk tahun ajaran baru 2026/2027.',
      },
    ];
    return {
      ...p,
      closedMessage: p.closedMessage || 'Mohon maaf, pendaftaran peserta didik baru saat ini belum dibuka atau kuota pada gelombang aktif telah terpenuhi. Silakan hubungi sekretariat via WhatsApp untuk masuk daftar tunggu (waiting list).',
      waves: p.waves && p.waves.length > 0 ? p.waves : defaultWaves,
    };
  })
  
  const [profile, setProfile] = useState<NonNullable<PageContent['profile']>>(
    data.pageContent.profile || {
      title: 'Pendidikan Islam Unggulan Berakar Karakter Qur’ani',
      description: 'TK Islam Al-Mustam berdiri dengan tekad melahirkan generasi muslim cilik yang beradab, mencintai Al-Qur’an, mandiri, dan berwawasan luas.',
      aboutParagraph1: 'TK Islam Al-Mustam didirikan dengan niat tulus menghadirkan lingkungan belajar anak usia dini yang sehat, hangat, dan berstandar nasional.',
      aboutParagraph2: 'Kurikulum kami memadukan Kurikulum Merdeka dengan metode sentra (BCCT) dan 7 Pilar Karakter Islami.',
      image: '/images/content/hero-school.jpg',
      imageAlt: 'Gedung TK Islam Al-Mustam',
    }
  )

  const [visionMission, setVisionMission] = useState<NonNullable<PageContent['visionMission']>>(
    data.pageContent.visionMission || {
      visionText: 'Menjadi lembaga pendidikan Islam unggulan yang melahirkan generasi Qur’ani, beradab, berakhlaqul karimah, dan cerdas holistik, serta membawa manfaat luas bagi umat dan bangsa.',
      missionList: [
        'Menyelenggarakan pendidikan anak usia dini berkualitas berpusat pada anak.',
        'Menanamkan aqidah lurus, pembiasaan sholat dhuha, dan tahfidz Juz 30.',
        'Mengembangkan potensi fitrah anak secara holistik.',
        'Menyelenggarakan beasiswa pendidikan yatim dan dhuafa.',
        'Membangun kemitraan harmonis dengan orang tua.',
        'Mengelola yayasan secara amanah, profesional, dan taat hukum.',
      ],
    }
  )

  const [sejarah, setSejarah] = useState<NonNullable<PageContent['sejarah']>>(
    data.pageContent.sejarah || {
      milestones: [
        { year: '2012', title: 'Awal Mula: Majelis Taklim & TPQ Kecil', desc: 'Bermula dari majelis taklim dan TPQ kecil dengan 15 murid.' },
        { year: '2016', title: 'Pendirian Resmi Yayasan Al-Mustam', desc: 'Yayasan resmi berbadan hukum melalui akta notaris dan SK Kemenkumham.' },
        { year: '2018', title: 'Pembukaan Kelompok Bermain (KB)', desc: 'KB dibuka melayani anak usia 3–4 tahun dengan stimulasi sensori.' },
        { year: '2020', title: 'Peresmian TK Islam Al-Mustam (TK A & TK B)', desc: 'Menerapkan Kurikulum Merdeka terintegrasi sentra BCCT.' },
        { year: '2022', title: 'Pengembangan Bantuan Pendidikan', desc: 'Pengembangan jalur beasiswa anak yatim dan dhuafa.' },
        { year: '2026', title: 'Penguatan Mutu & Layanan', desc: 'Pengembangan program dan digitalisasi informasi sekolah.' },
      ],
    }
  )

  const subTabs = [
    { id: 'beranda', label: '1. Beranda Depan', icon: Image, note: 'Foto utama & sambutan' },
    { id: 'profil', label: '2. Profil Sekolah', icon: Building2, note: 'Cerita sekolah & foto gedung' },
    { id: 'visimisi', label: '3. Visi & Misi', icon: Target, note: 'Pernyataan visi & butir misi' },
    { id: 'sejarah', label: '4. Sejarah Perjalanan', icon: History, note: 'Tahun & jejak langkah' },
    { id: 'ppdb', label: '5. Brosur & PPDB', icon: ScrollText, note: 'Tahun ajaran & syarat berkas' },
  ] as const

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER PENJELAS RAMAH ORANG AWAM */}
      <header className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="font-heading text-xl font-extrabold text-primary">Edit Tulisan &amp; Foto Halaman Website</h2>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink-soft max-w-3xl">
          Pilih halaman yang ingin Bapak/Ibu ubah melalui tab di bawah ini. Cukup ketik tulisan baru atau pilih foto dari HP/komputer, lalu tekan tombol <strong>"Simpan Perubahan"</strong> di bawah formulir.
        </p>

        {/* SUB TAB NAVIGATOR BERBASIS NAMA HALAMAN */}
        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-primary/5 pt-5">
          {subTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft ring-2 ring-primary/20'
                    : 'bg-cream text-ink-soft hover:bg-softgreen hover:text-primary'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-gold' : 'text-primary'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* ========================================================= */}
      {/* TAB 1: BERANDA & SAMBUTAN                                 */}
      {/* ========================================================= */}
      {activeSubTab === 'beranda' && (
        <div className="space-y-6">
          {/* Form Hero */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updatePageContent('hero', hero)
            }}
            className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary">
                <Image className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-primary">Foto &amp; Slogan Utama Halaman Depan</h3>
                <p className="text-xs text-ink-mute">Bagian paling atas yang pertama kali dilihat saat orang membuka website.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Awal Judul Besar" hint="Contoh: Membentuk Generasi">
                <input className={inputClass} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
              </Field>
              <Field label="Kata Sorotan (Warna Emas)" hint="Contoh: Qur’ani">
                <input className={inputClass} value={hero.highlight} onChange={(e) => setHero({ ...hero, highlight: e.target.value })} />
              </Field>
              <Field label="Akhir Judul" hint="Contoh: Beradab, &amp; Cerdas Holistik." className="sm:col-span-2">
                <input className={inputClass} value={hero.titleSuffix} onChange={(e) => setHero({ ...hero, titleSuffix: e.target.value })} />
              </Field>
              <Field label="Kalimat Penjelas / Deskripsi Singkat" hint="Pesan ramah untuk orang tua murid" className="sm:col-span-2">
                <textarea rows={3} className={inputClass} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Foto Utama Sekolah di Halaman Depan"
                  value={hero.image}
                  onChange={(img) => setHero({ ...hero, image: img })}
                  altValue={hero.imageAlt}
                  onAltChange={(alt) => setHero({ ...hero, imageAlt: alt })}
                  recommended="Disarankan foto murid bersama guru atau suasana kampus yang cerah dan rapi (rasio 4:3)."
                  required
                />
              </div>
              <Field label="Poin-Poin Keunggulan (Ketik 1 baris untuk 1 poin)" className="sm:col-span-2">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={hero.benefits.join('\n')}
                  onChange={(e) => setHero({ ...hero, benefits: e.target.value.split('\n').filter(Boolean) })}
                />
              </Field>
            </div>
            <SaveButton />
          </form>

          {/* Form Sambutan */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updatePageContent('welcome', welcome)
            }}
            className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-gold-ink">
                <School className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-primary">Sambutan Resmi Kepala Sekolah</h3>
                <p className="text-xs text-ink-mute">Foto dan pesan hangat kepala sekolah yang tampil di halaman depan.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nama Kepala Sekolah / Pimpinan" hint="Sertakan gelar jika ada">
                <input className={inputClass} value={welcome.personName} onChange={(e) => setWelcome({ ...welcome, personName: e.target.value })} />
              </Field>
              <Field label="Jabatan Resmi" hint="Contoh: Kepala TK Islam Al-Mustam">
                <input className={inputClass} value={welcome.personRole} onChange={(e) => setWelcome({ ...welcome, personRole: e.target.value })} />
              </Field>
              <Field label="Kutipan Singkat / Kata Mutiara" hint="Akan tampil dalam tanda petik besar" className="sm:col-span-2">
                <textarea rows={2} className={inputClass} value={welcome.quote} onChange={(e) => setWelcome({ ...welcome, quote: e.target.value })} />
              </Field>
              <Field label="Isi Pesan Sambutan Lengkap" className="sm:col-span-2">
                <textarea rows={4} className={inputClass} value={welcome.body} onChange={(e) => setWelcome({ ...welcome, body: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Foto Resmi Kepala Sekolah"
                  value={welcome.image}
                  onChange={(img) => setWelcome({ ...welcome, image: img })}
                  altValue={welcome.imageAlt}
                  onAltChange={(alt) => setWelcome({ ...welcome, imageAlt: alt })}
                  recommended="Gunakan foto potret setengah badan yang sopan dan profesional (rasio 3:4 atau 4:5)."
                  required
                />
              </div>
            </div>
            <SaveButton />
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROFIL YAYASAN & FOTO GEDUNG                       */}
      {/* ========================================================= */}
      {activeSubTab === 'profil' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updatePageContent('profile', profile)
          }}
          className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Profil Yayasan &amp; Foto Kampus</h3>
              <p className="text-xs text-ink-mute">Mengatur teks narasi dan foto gedung yang tampil di halaman Profil (/profil).</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Judul Halaman Profil" className="sm:col-span-2">
              <input className={inputClass} value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
            </Field>
            <Field label="Deskripsi Pengantar" className="sm:col-span-2">
              <textarea rows={2} className={inputClass} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Foto Gedung / Suasana Kampus Sekolah"
                value={profile.image}
                onChange={(img) => setProfile({ ...profile, image: img })}
                altValue={profile.imageAlt}
                onAltChange={(alt) => setProfile({ ...profile, imageAlt: alt })}
                recommended="Foto tampak depan sekolah atau area gerbang yang asri dan representatif (rasio 4:3)."
                required
              />
            </div>
            <Field label="Cerita Sejarah Paragraf 1" hint="Tentang awal mula pendirian sekolah" className="sm:col-span-2">
              <textarea rows={4} className={inputClass} value={profile.aboutParagraph1} onChange={(e) => setProfile({ ...profile, aboutParagraph1: e.target.value })} />
            </Field>
            <Field label="Cerita Sejarah Paragraf 2" hint="Tentang nilai kurikulum dan komitmen pendampingan" className="sm:col-span-2">
              <textarea rows={4} className={inputClass} value={profile.aboutParagraph2} onChange={(e) => setProfile({ ...profile, aboutParagraph2: e.target.value })} />
            </Field>
          </div>
          <SaveButton />
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VISI & MISI LEMBAGA                                */}
      {/* ========================================================= */}
      {activeSubTab === 'visimisi' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updatePageContent('visionMission', visionMission)
          }}
          className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-gold-ink">
              <Target className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Visi &amp; Misi Lembaga</h3>
              <p className="text-xs text-ink-mute">Mengatur teks visi utama dan daftar butir misi di halaman Visi Misi (/visi-misi).</p>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Pernyataan Visi Utama Sekolah" hint="Cita-cita jangka panjang yang ingin dicapai bersama">
              <textarea rows={3} className={inputClass} value={visionMission.visionText} onChange={(e) => setVisionMission({ ...visionMission, visionText: e.target.value })} />
            </Field>

            <Field label="Daftar Butir Misi (Tulis 1 baris untuk setiap poin misi)" hint="Poin-poin langkah nyata sekolah">
              <textarea
                rows={7}
                className={inputClass}
                value={visionMission.missionList.join('\n')}
                onChange={(e) => setVisionMission({ ...visionMission, missionList: e.target.value.split('\n').filter(Boolean) })}
              />
            </Field>
          </div>
          <SaveButton />
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SEJARAH & PERJALANAN                               */}
      {/* ========================================================= */}
      {activeSubTab === 'sejarah' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updatePageContent('sejarah', sejarah)
          }}
          className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary">
              <History className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Tonggak Sejarah &amp; Perjalanan</h3>
              <p className="text-xs text-ink-mute">Timeline tahun berdiri dan fase perkembangan di halaman Sejarah (/sejarah).</p>
            </div>
          </div>

          <div className="space-y-4">
            {sejarah.milestones.map((m, idx) => (
              <div key={idx} className="rounded-2xl border border-primary/15 bg-cream/30 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-24 shrink-0">
                  <span className="block text-xs font-bold text-ink-mute mb-1">Tahun</span>
                  <input
                    className={inputClass}
                    value={m.year}
                    onChange={(e) => {
                      const updated = [...sejarah.milestones]
                      updated[idx].year = e.target.value
                      setSejarah({ milestones: updated })
                    }}
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <div>
                    <span className="block text-xs font-bold text-ink-mute mb-1">Judul Peristiwa</span>
                    <input
                      className={inputClass}
                      value={m.title}
                      onChange={(e) => {
                        const updated = [...sejarah.milestones]
                        updated[idx].title = e.target.value
                        setSejarah({ milestones: updated })
                      }}
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-ink-mute mb-1">Deskripsi Singkat</span>
                    <textarea
                      rows={2}
                      className={inputClass}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...sejarah.milestones]
                        updated[idx].desc = e.target.value
                        setSejarah({ milestones: updated })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SaveButton />
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 5: BROSUR & SYARAT PPDB                               */}
      {/* ========================================================= */}
      {activeSubTab === 'ppdb' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updatePageContent('ppdb', ppdb)
          }}
          className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-3.5 border-b border-primary/5 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softblue text-secondary-dark">
              <ScrollText className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Informasi Brosur, Gelombang &amp; Akses Pendaftaran</h3>
              <p className="text-xs text-ink-mute">Atur buka/tutup pendaftaran, jadwal 2 gelombang (Gelombang 1 &amp; 2), pesan permohonan maaf, serta berkas persyaratan.</p>
            </div>
          </div>

          {/* 1. MASTER SWITCH & PERMOHONAN MAAF */}
          <div className="rounded-2xl border border-primary/15 bg-cream/30 p-5 space-y-4">
            <h4 className="font-heading text-sm font-extrabold text-primary">1. Sakelar Utama &amp; Status Akses Pendaftaran</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tahun Ajaran Aktif" hint="Contoh: 2026/2027">
                <input className={inputClass} value={ppdb.academicYear} onChange={(e) => setPpdb({ ...ppdb, academicYear: e.target.value })} />
              </Field>

              <div className="flex flex-col justify-end">
                <label className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-primary/20 bg-white px-4 text-sm font-bold text-ink cursor-pointer hover:border-primary transition-all">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary rounded cursor-pointer"
                    checked={ppdb.registrationOpen}
                    onChange={(e) => setPpdb({ ...ppdb, registrationOpen: e.target.checked })}
                  />
                  <span>
                    {ppdb.registrationOpen ? '🟢 Pendaftaran Sedang DIBUKA' : '🔴 Pendaftaran DITUTUP (Terkunci)'}
                  </span>
                </label>
              </div>
            </div>

            {/* Pesan Permohonan Maaf Saat Ditutup */}
            <Field
              label="Teks Pesan Permohonan Maaf (Tampil Saat Pendaftaran Ditutup / Belum Dibuka)"
              hint="Pesan ini akan tampil di layar pengunjung jika pendaftaran ditutup, agar calon wali murid paham dan dialihkan ke WhatsApp"
            >
              <textarea
                rows={2}
                className={inputClass}
                value={ppdb.closedMessage || ''}
                onChange={(e) => setPpdb({ ...ppdb, closedMessage: e.target.value })}
                placeholder="Mohon maaf, pendaftaran peserta didik baru saat ini belum dibuka..."
              />
            </Field>
          </div>

          {/* 2. PENGATURAN DUA GELOMBANG (GELOMBANG 1 & GELOMBANG 2) */}
          <div className="rounded-2xl border border-gold/30 bg-softyellow/20 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-sm font-extrabold text-primary">2. Pengaturan 2 Gelombang Pendaftaran PPDB</h4>
                <p className="text-xs text-ink-mute">Atur status buka/tutup masing-masing gelombang secara mandiri.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* GELOMBANG 1 */}
              {(ppdb.waves || []).map((wave, idx) => {
                const isWave1 = wave.id === 'gelombang-1'
                const updateWave = (patch: Partial<PPDBWave>) => {
                  const newWaves = [...(ppdb.waves || [])]
                  newWaves[idx] = { ...wave, ...patch }
                  setPpdb({ ...ppdb, waves: newWaves })
                }

                return (
                  <div key={wave.id} className="rounded-2xl border border-primary/10 bg-white p-5 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-primary/5 pb-2.5">
                      <span className="font-heading text-xs font-black uppercase tracking-wider text-primary">
                        {isWave1 ? '📌 GELOMBANG 1' : '📌 GELOMBANG 2'}
                      </span>
                      <select
                        value={wave.status}
                        onChange={(e) => updateWave({ status: e.target.value as any })}
                        className="rounded-lg border border-primary/20 bg-cream/50 px-2.5 py-1 text-xs font-bold text-primary outline-none"
                      >
                        <option value="OPEN">🟢 DIBUKA (Aktif)</option>
                        <option value="CLOSED">🔴 DITUTUP</option>
                        <option value="UPCOMING">🟡 BELUM DIBUKA</option>
                      </select>
                    </div>

                    <Field label="Nama Gelombang">
                      <input className={inputClass} value={wave.name} onChange={(e) => updateWave({ name: e.target.value })} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Jadwal / Periode">
                        <input className={inputClass} value={wave.period} onChange={(e) => updateWave({ period: e.target.value })} />
                      </Field>
                      <Field label="Keterangan Kuota">
                        <input className={inputClass} value={wave.quota || ''} onChange={(e) => updateWave({ quota: e.target.value })} placeholder="Contoh: Sisa 8 Kuota" />
                      </Field>
                    </div>

                    <Field label="Keterangan Tambahan / Manfaat Gelombang">
                      <input className={inputClass} value={wave.description || ''} onChange={(e) => updateWave({ description: e.target.value })} placeholder="Diskon infaq sarana, dsb." />
                    </Field>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. TULISAN PENGANTAR & PERSYARATAN BERKAS */}
          <div className="space-y-4 pt-2">
            <Field label="Judul Brosur PPDB">
              <input className={inputClass} value={ppdb.title} onChange={(e) => setPpdb({ ...ppdb, title: e.target.value })} />
            </Field>

            <Field label="Deskripsi Pengantar">
              <textarea rows={2} className={inputClass} value={ppdb.description} onChange={(e) => setPpdb({ ...ppdb, description: e.target.value })} />
            </Field>

            <Field label="Persyaratan Berkas (Tulis 1 baris untuk 1 dokumen berkas)" hint="Akan tampil sebagai checklist berkas di brosur">
              <textarea
                rows={4}
                className={inputClass}
                value={ppdb.requirements.join('\n')}
                onChange={(e) => setPpdb({ ...ppdb, requirements: e.target.value.split('\n').filter(Boolean) })}
              />
            </Field>
          </div>

          <SaveButton />
        </form>
      )}
    </div>
  )
}

function Field({ label, hint, className = '', children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-bold text-primary">{label}</span>
      {hint && <span className="mb-1.5 block text-[11px] text-ink-mute">{hint}</span>}
      {children}
    </label>
  )
}

function SaveButton() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-primary/10 pt-5">
      <p className="text-xs text-ink-mute">
        *Perubahan akan langsung tersimpan di sistem dan dapat dilihat langsung di website publik.
      </p>
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift w-full sm:w-auto"
      >
        <Save className="h-4 w-4 text-gold" />
        <span>Simpan Perubahan ke Website</span>
      </button>
    </div>
  )
}
