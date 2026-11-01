import { useState } from 'react'
import { BookOpen, Edit3, Plus, Trash2, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { DoaItem, IslamicArticle } from '../../../types/cms'
import ImageUploadField from './ImageUploadField'

type Editor = { kind: 'doa'; original?: string; value: DoaItem } | { kind: 'article'; original?: string; value: IslamicArticle }
const inputClass = 'w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary'
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

export default function KhazanahManagementTab() {
  const { data, addDoa, updateDoa, deleteDoa, addIslamicArticle, updateIslamicArticle, deleteIslamicArticle } = useCMS()
  const [editor, setEditor] = useState<Editor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ kind: 'doa' | 'article'; slug: string; title: string } | null>(null)

  const openDoa = (item?: DoaItem) => setEditor({ kind: 'doa', original: item?.slug, value: item ?? { slug: '', title: '', category: 'Doa Harian', arabic: '', latin: '', meaning: '', virtue: '', status: 'DRAFT' } })
  const openArticle = (item?: IslamicArticle) => setEditor({ kind: 'article', original: item?.slug, value: item ?? { slug: '', title: '', category: 'Parenting Islami', excerpt: '', readTime: '4 menit', content: [''], image: '', imageAlt: '', status: 'DRAFT' } })

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editor) return
    const slug = editor.value.slug || slugify(editor.value.title)
    if (!slug || !editor.value.title.trim()) return
    if (editor.kind === 'doa') {
      const value = { ...editor.value, slug }
      if (editor.original) updateDoa(editor.original, value)
      else addDoa(value)
    } else {
      const value = { ...editor.value, slug, content: editor.value.content.filter(Boolean) }
      if (editor.original) updateIslamicArticle(editor.original, value)
      else addIslamicArticle(value)
    }
    setEditor(null)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.kind === 'doa') deleteDoa(deleteTarget.slug)
    else deleteIslamicArticle(deleteTarget.slug)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 pb-12">
      <header className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softgreen text-primary"><BookOpen className="h-5 w-5" /></span><div><h2 className="font-heading text-lg font-extrabold text-primary">Khazanah Islami</h2><p className="text-xs text-ink-mute">Kelola doa harian dan artikel parenting yang tampil di halaman publik.</p></div></div>
      </header>

      <ContentList title="Doa Harian" count={data.doas.length} onAdd={() => openDoa()}>
        {data.doas.map((item) => <Row key={item.slug} title={item.title} meta={`${item.category} • ${item.status === 'DRAFT' ? 'Draft' : 'Publik'}`} onEdit={() => openDoa(item)} onDelete={() => setDeleteTarget({ kind: 'doa', slug: item.slug, title: item.title })} />)}
      </ContentList>

      <ContentList title="Artikel Parenting" count={data.islamicArticles.length} onAdd={() => openArticle()}>
        {data.islamicArticles.map((item) => <Row key={item.slug} title={item.title} meta={`${item.category} • ${item.readTime} baca • ${item.status === 'DRAFT' ? 'Draft' : 'Publik'}`} onEdit={() => openArticle(item)} onDelete={() => setDeleteTarget({ kind: 'article', slug: item.slug, title: item.title })} />)}
      </ContentList>

      {editor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary-deep/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={save} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4"><h3 className="font-heading text-lg font-extrabold text-primary">{editor.original ? 'Edit' : 'Tambah'} {editor.kind === 'doa' ? 'Doa' : 'Artikel'}</h3><button type="button" onClick={() => setEditor(null)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-ink-mute" aria-label="Tutup editor"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Judul"><input required className={inputClass} value={editor.value.title} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, title: e.target.value } } as Editor)} /></Field>
              <Field label="Slug URL"><input className={inputClass} value={editor.value.slug} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, slug: e.target.value } } as Editor)} placeholder="otomatis-dari-judul" /></Field>
              <Field label="Kategori"><input className={inputClass} value={editor.value.category} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, category: e.target.value } } as Editor)} /></Field>
              <Field label="Status"><select className={inputClass} value={editor.value.status ?? 'PUBLISHED'} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, status: e.target.value as 'DRAFT' | 'PUBLISHED' } } as Editor)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Publikasikan</option></select></Field>
              {editor.kind === 'doa' ? <>
                <Field label="Teks Arab" className="sm:col-span-2"><textarea required dir="rtl" rows={3} className={inputClass} value={editor.value.arabic} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, arabic: e.target.value } })} /></Field>
                <Field label="Latin" className="sm:col-span-2"><textarea required rows={2} className={inputClass} value={editor.value.latin} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, latin: e.target.value } })} /></Field>
                <Field label="Arti" className="sm:col-span-2"><textarea required rows={3} className={inputClass} value={editor.value.meaning} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, meaning: e.target.value } })} /></Field>
                <Field label="Keutamaan / catatan" className="sm:col-span-2"><textarea rows={2} className={inputClass} value={editor.value.virtue ?? ''} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, virtue: e.target.value } })} /></Field>
              </> : <>
                <Field label="Durasi baca"><input className={inputClass} value={editor.value.readTime} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, readTime: e.target.value } })} /></Field>
                <div className="sm:col-span-2"><ImageUploadField label="Gambar artikel" value={editor.value.image ?? ''} onChange={(image) => setEditor({ ...editor, value: { ...editor.value, image } })} altValue={editor.value.imageAlt ?? ''} onAltChange={(imageAlt) => setEditor({ ...editor, value: { ...editor.value, imageAlt } })} recommended="Rasio 16:9 disarankan." /></div>
                <Field label="Ringkasan" className="sm:col-span-2"><textarea required rows={3} className={inputClass} value={editor.value.excerpt} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, excerpt: e.target.value } })} /></Field>
                <Field label="Isi artikel (satu paragraf per baris)" className="sm:col-span-2"><textarea required rows={7} className={inputClass} value={editor.value.content.join('\n')} onChange={(e) => setEditor({ ...editor, value: { ...editor.value, content: e.target.value.split('\n') } })} /></Field>
              </>}
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-primary/10 pt-5"><button type="button" onClick={() => setEditor(null)} className="min-h-11 rounded-full px-5 text-sm font-bold text-ink-mute">Batal</button><button type="submit" className="min-h-11 rounded-full bg-primary px-6 text-sm font-bold text-white">Simpan konten</button></div>
          </form>
        </div>
      )}

      {deleteTarget && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-primary-deep/70 p-4" role="alertdialog" aria-modal="true"><div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-lift"><h3 className="font-heading font-extrabold text-primary">Hapus konten?</h3><p className="mt-2 text-sm text-ink-mute">“{deleteTarget.title}” akan hilang dari CMS dan halaman publik.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="min-h-11 rounded-full bg-cream px-5 text-sm font-bold text-ink">Batal</button><button type="button" onClick={confirmDelete} className="min-h-11 rounded-full bg-warmred px-5 text-sm font-bold text-white">Hapus</button></div></div></div>}
    </div>
  )
}

function ContentList({ title, count, onAdd, children }: { title: string; count: number; onAdd: () => void; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-heading font-extrabold text-primary">{title}</h3><p className="text-xs text-ink-mute">{count} konten tersimpan</p></div><button type="button" onClick={onAdd} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Tambah</button></div><div className="divide-y divide-primary/5">{children}</div></section>
}

function Row({ title, meta, onEdit, onDelete }: { title: string; meta: string; onEdit: () => void; onDelete: () => void }) {
  return <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{title}</p><p className="mt-1 text-xs text-ink-mute">{meta}</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/15 px-4 text-xs font-bold text-primary"><Edit3 className="h-4 w-4" />Edit</button><button type="button" onClick={onDelete} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-warmred/20 px-4 text-xs font-bold text-warmred"><Trash2 className="h-4 w-4" />Hapus</button></div></div>
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={className}><span className="mb-1.5 block text-xs font-bold text-ink">{label}</span>{children}</label>
}
