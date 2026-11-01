import { useState } from 'react'
import { Image, Save, School, ScrollText } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { PageContent } from '../../../types/cms'
import ImageUploadField from './ImageUploadField'

const inputClass = 'w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'

export default function PageContentManagementTab() {
  const { data, updatePageContent } = useCMS()
  const [hero, setHero] = useState<PageContent['hero']>(data.pageContent.hero)
  const [welcome, setWelcome] = useState<PageContent['welcome']>(data.pageContent.welcome)
  const [ppdb, setPpdb] = useState<PageContent['ppdb']>(data.pageContent.ppdb)

  return (
    <div className="space-y-6 pb-12">
      <header className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg font-extrabold text-primary">Konten Halaman Publik</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ink-mute">
          Ubah isi utama beranda dan informasi PPDB. Perubahan tersimpan di CMS dan langsung dibaca oleh web informasi.
        </p>
      </header>

      <form
        onSubmit={(event) => { event.preventDefault(); updatePageContent('hero', hero) }}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softgreen text-primary"><Image className="h-5 w-5" /></span>
          <div><h3 className="font-heading font-extrabold text-primary">Hero Beranda</h3><p className="text-xs text-ink-mute">Judul, pesan utama, manfaat, dan gambar pertama.</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label atas"><input className={inputClass} value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} /></Field>
          <Field label="Label tombol PPDB"><input className={inputClass} value={hero.primaryLabel} onChange={(e) => setHero({ ...hero, primaryLabel: e.target.value })} /></Field>
          <Field label="Awal judul"><input className={inputClass} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></Field>
          <Field label="Kata sorotan"><input className={inputClass} value={hero.highlight} onChange={(e) => setHero({ ...hero, highlight: e.target.value })} /></Field>
          <Field label="Akhir judul" className="sm:col-span-2"><input className={inputClass} value={hero.titleSuffix} onChange={(e) => setHero({ ...hero, titleSuffix: e.target.value })} /></Field>
          <Field label="Deskripsi" className="sm:col-span-2"><textarea rows={3} className={inputClass} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} /></Field>
          <div className="sm:col-span-2"><ImageUploadField label="Gambar utama beranda" value={hero.image} onChange={(image) => setHero({ ...hero, image })} altValue={hero.imageAlt} onAltChange={(imageAlt) => setHero({ ...hero, imageAlt })} recommended="Rasio 4:3 atau 16:9 disarankan." required /></div>
          <Field label="Manfaat (satu baris satu poin)" className="sm:col-span-2"><textarea rows={4} className={inputClass} value={hero.benefits.join('\n')} onChange={(e) => setHero({ ...hero, benefits: e.target.value.split('\n').filter(Boolean) })} /></Field>
        </div>
        <SaveButton />
      </form>

      <form
        onSubmit={(event) => { event.preventDefault(); updatePageContent('welcome', welcome) }}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softyellow text-gold-ink"><School className="h-5 w-5" /></span>
          <div><h3 className="font-heading font-extrabold text-primary">Sambutan Sekolah</h3><p className="text-xs text-ink-mute">Pernyataan resmi dan identitas penanggung jawab.</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label bagian"><input className={inputClass} value={welcome.eyebrow} onChange={(e) => setWelcome({ ...welcome, eyebrow: e.target.value })} /></Field>
          <Field label="Judul"><input className={inputClass} value={welcome.title} onChange={(e) => setWelcome({ ...welcome, title: e.target.value })} /></Field>
          <Field label="Kutipan" className="sm:col-span-2"><textarea rows={2} className={inputClass} value={welcome.quote} onChange={(e) => setWelcome({ ...welcome, quote: e.target.value })} /></Field>
          <Field label="Isi sambutan" className="sm:col-span-2"><textarea rows={4} className={inputClass} value={welcome.body} onChange={(e) => setWelcome({ ...welcome, body: e.target.value })} /></Field>
          <Field label="Nama"><input className={inputClass} value={welcome.personName} onChange={(e) => setWelcome({ ...welcome, personName: e.target.value })} /></Field>
          <Field label="Jabatan"><input className={inputClass} value={welcome.personRole} onChange={(e) => setWelcome({ ...welcome, personRole: e.target.value })} /></Field>
          <div className="sm:col-span-2"><ImageUploadField label="Foto sambutan" value={welcome.image} onChange={(image) => setWelcome({ ...welcome, image })} altValue={welcome.imageAlt} onAltChange={(imageAlt) => setWelcome({ ...welcome, imageAlt })} recommended="Gunakan foto potret resmi dengan rasio 3:4." required /></div>
        </div>
        <SaveButton />
      </form>

      <form
        onSubmit={(event) => { event.preventDefault(); updatePageContent('ppdb', ppdb) }}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softblue text-secondary-dark"><ScrollText className="h-5 w-5" /></span>
          <div><h3 className="font-heading font-extrabold text-primary">Informasi PPDB Publik</h3><p className="text-xs text-ink-mute">Tahun ajaran, status pendaftaran, pengantar, dan dokumen wajib.</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tahun ajaran"><input className={inputClass} value={ppdb.academicYear} onChange={(e) => setPpdb({ ...ppdb, academicYear: e.target.value })} /></Field>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-primary/10 bg-cream/40 px-4 text-sm font-bold text-ink">
            <input type="checkbox" className="h-5 w-5 accent-primary" checked={ppdb.registrationOpen} onChange={(e) => setPpdb({ ...ppdb, registrationOpen: e.target.checked })} /> Pendaftaran sedang dibuka
          </label>
          <Field label="Judul halaman" className="sm:col-span-2"><input className={inputClass} value={ppdb.title} onChange={(e) => setPpdb({ ...ppdb, title: e.target.value })} /></Field>
          <Field label="Deskripsi" className="sm:col-span-2"><textarea rows={3} className={inputClass} value={ppdb.description} onChange={(e) => setPpdb({ ...ppdb, description: e.target.value })} /></Field>
          <Field label="Catatan pendaftaran" className="sm:col-span-2"><textarea rows={2} className={inputClass} value={ppdb.notice} onChange={(e) => setPpdb({ ...ppdb, notice: e.target.value })} /></Field>
          <Field label="Persyaratan (satu baris satu dokumen)" className="sm:col-span-2"><textarea rows={5} className={inputClass} value={ppdb.requirements.join('\n')} onChange={(e) => setPpdb({ ...ppdb, requirements: e.target.value.split('\n').filter(Boolean) })} /></Field>
        </div>
        <SaveButton />
      </form>
    </div>
  )
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={className}><span className="mb-1.5 block text-xs font-bold text-ink">{label}</span>{children}</label>
}

function SaveButton() {
  return <div className="mt-6 flex justify-end border-t border-primary/5 pt-5"><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-light"><Save className="h-4 w-4" />Simpan perubahan</button></div>
}
