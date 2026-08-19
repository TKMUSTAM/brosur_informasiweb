import { useState, useMemo } from 'react'
import { Plus, Search, Edit3, Trash2, Calendar, Sparkles, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { NewsItem } from '../../../types/cms'

const CATEGORIES = ['Semua', 'PHBI', 'Kegiatan Anak', 'Kajian', 'Yatim', 'Pendidikan']

export default function NewsManagementTab() {
  const { data, addNews, updateNews, deleteNews } = useCMS()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<NewsItem, 'slug'> & { slug?: string }>({
    title: '',
    category: 'Kegiatan Anak',
    date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
    dateISO: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: [''],
    color: 'green',
    featured: false,
    image: '',
  })

  // Delete Confirm State
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null)

  const filteredNews = useMemo(() => {
    return data.news.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'Semua' || item.category === category
      return matchSearch && matchCategory
    })
  }, [data.news, search, category])

  const openCreateModal = () => {
    setEditingSlug(null)
    setFormData({
      title: '',
      category: 'Kegiatan Anak',
      date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      dateISO: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: [''],
      color: 'green',
      featured: false,
      image: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: NewsItem) => {
    setEditingSlug(item.slug)
    setFormData({
      slug: item.slug,
      title: item.title,
      category: item.category,
      date: item.date,
      dateISO: item.dateISO,
      excerpt: item.excerpt,
      content: item.content.length > 0 ? item.content : [''],
      color: item.color,
      featured: item.featured || false,
      image: item.image || '',
    })
    setIsModalOpen(true)
  }

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...formData.content]
    updated[index] = val
    setFormData((prev) => ({ ...prev, content: updated }))
  }

  const addParagraph = () => {
    setFormData((prev) => ({ ...prev, content: [...prev.content, ''] }))
  }

  const removeParagraph = (index: number) => {
    if (formData.content.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const cleanedContent = formData.content.filter((c) => c.trim().length > 0)
    const payload = {
      ...formData,
      content: cleanedContent.length > 0 ? cleanedContent : [formData.excerpt || formData.title],
    }

    if (editingSlug) {
      updateNews(editingSlug, payload)
    } else {
      addNews(payload)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (slug: string) => {
    deleteNews(slug)
    setDeleteConfirmSlug(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Berita & Kegiatan</h3>
          <p className="text-xs text-ink-mute">Total {data.news.length} artikel terpublikasi di website</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari judul berita atau ringkasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-primary/15 bg-white px-4 py-3 pl-11 text-sm text-ink outline-none shadow-soft focus:border-primary"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-ink-mute hover:bg-cream hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* NEWS LIST / CARDS */}
      <div className="grid gap-4">
        {filteredNews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary/20 bg-white/60 p-12 text-center">
            <p className="text-sm font-bold text-ink-mute">Tidak ada berita yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          filteredNews.map((item) => (
            <div
              key={item.slug}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-soft transition-all hover:border-primary/25 hover:shadow-lift sm:flex-row sm:items-center"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-softgreen px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-softyellow px-2.5 py-0.5 text-[11px] font-bold text-gold-ink">
                      <Sparkles className="h-3 w-3" /> Utama (Featured)
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-ink-mute">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                </div>
                <h4 className="font-heading text-base font-extrabold text-ink group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h4>
                <p className="line-clamp-2 text-xs text-ink-mute leading-relaxed">{item.excerpt}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 border-t border-primary/5 pt-3 sm:border-t-0 sm:pt-0">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/15 bg-cream/50 px-3.5 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSlug(item.slug)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-warmred/20 bg-softred/20 text-warmred transition-colors hover:bg-warmred hover:text-white"
                  title="Hapus berita"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL TAMBAH / EDIT BERITA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {editingSlug ? 'Edit Artikel Berita' : 'Tambah Berita Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink-mute hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Judul Artikel</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Peringatan Maulid Nabi di TK Al-Mustam"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  >
                    {CATEGORIES.filter((c) => c !== 'Semua').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Tanggal Publikasi</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="1-2 kalimat pengantar yang menarik..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-ink">Paragraf Konten Berita</label>
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Tambah Paragraf
                  </button>
                </div>
                <div className="space-y-2.5">
                  {formData.content.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => handleParagraphChange(idx, e.target.value)}
                        placeholder={`Paragraf ${idx + 1}...`}
                        className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
                      />
                      {formData.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(idx)}
                          className="mt-2 text-ink-mute hover:text-warmred p-1"
                          title="Hapus paragraf ini"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-ink cursor-pointer">
                  Tampilkan sebagai Berita Utama (Featured di Header Berita)
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink-mute hover:bg-cream"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-white shadow-soft hover:bg-primary-light"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift text-center">
            <h4 className="font-heading text-base font-extrabold text-primary">Konfirmasi Hapus Berita</h4>
            <p className="mt-2 text-xs text-ink-mute">
              Apakah Anda yakin ingin menghapus artikel berita ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmSlug(null)}
                className="rounded-full bg-cream px-5 py-2.5 text-xs font-bold text-ink"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmSlug)}
                className="rounded-full bg-warmred px-5 py-2.5 text-xs font-extrabold text-white shadow-soft hover:bg-warmred-dark"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
