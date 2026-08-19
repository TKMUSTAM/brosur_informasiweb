import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit3, Image as ImageIcon, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { GalleryItem } from '../../../types/cms'
import { galleryCategories } from '../../../data/gallery'

export default function GalleryManagementTab() {
  const { data, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useCMS()
  const [selectedCat, setSelectedCat] = useState('Semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'Pembelajaran',
    scene: 'quran',
    palette: 'green',
    image: '',
  })

  const filtered = useMemo(() => {
    if (selectedCat === 'Semua') return data.gallery
    return data.gallery.filter((g) => g.category === selectedCat)
  }, [data.gallery, selectedCat])

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      title: '',
      category: 'Pembelajaran',
      scene: 'quran',
      palette: 'green',
      image: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: GalleryItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      category: item.category,
      scene: item.scene,
      palette: item.palette,
      image: item.image || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingId) {
      updateGalleryItem(editingId, formData)
    } else {
      addGalleryItem(formData)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Galeri Aktivitas</h3>
          <p className="text-xs text-ink-mute">Kelola dokumentasi foto kegiatan santri ({data.gallery.length} foto)</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* FILTER KATEGORI */}
      <div className="flex flex-wrap gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-ink-mute hover:bg-cream hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID GALERI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft transition-all hover:border-primary/25 hover:shadow-lift"
          >
            <div className="relative flex aspect-video items-center justify-center bg-cream/70 p-4">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-soft">
                  <ImageIcon className="h-6 w-6" />
                </span>
                <span className="text-[10px] font-bold text-ink-mute">Scene: {item.scene}</span>
              </div>
              <span className="absolute right-3 top-3 rounded-full bg-primary/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {item.category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="font-heading text-sm font-extrabold text-ink line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between border-t border-primary/5 pt-3">
                <span className="text-[10px] font-semibold text-ink-mute">ID: #{item.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream text-primary hover:bg-primary hover:text-white"
                    title="Edit"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteGalleryItem(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-softred/20 text-warmred hover:bg-warmred hover:text-white"
                    title="Hapus"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH/EDIT GALERI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {editingId ? 'Edit Item Galeri' : 'Tambah Foto Galeri'}
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
                <label className="mb-1 block text-xs font-bold text-ink">Judul Aktivitas / Foto</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Praktik Wudhu dan Sholat Berjamaah"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Kategori Aktivitas</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                >
                  {galleryCategories.filter((c) => c !== 'Semua').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Tema Scene</label>
                  <select
                    value={formData.scene}
                    onChange={(e) => setFormData((p) => ({ ...p, scene: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
                  >
                    <option value="quran">Al-Qur’an / Mengaji</option>
                    <option value="pray">Sholat / Wudhu</option>
                    <option value="blocks">Bermain Balok</option>
                    <option value="nature">Kebun / Outing</option>
                    <option value="mosque">Masjid / PHBI</option>
                    <option value="share">Sosial / Berbagi</option>
                    <option value="paint">Seni & Mewarnai</option>
                    <option value="books">Membaca Buku</option>
                    <option value="hands">Doa Harian</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Palet Warna</label>
                  <select
                    value={formData.palette}
                    onChange={(e) => setFormData((p) => ({ ...p, palette: e.target.value as any }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
                  >
                    <option value="green">Hijau Islami</option>
                    <option value="gold">Kuning Gold</option>
                    <option value="blue">Biru Edukasi</option>
                    <option value="red">Merah Hangat</option>
                    <option value="mixed">Kombinasi</option>
                  </select>
                </div>
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
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
