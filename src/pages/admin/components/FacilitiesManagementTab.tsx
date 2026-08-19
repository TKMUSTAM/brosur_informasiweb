import { useState } from 'react'
import { Plus, Trash2, Edit3, Building, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { FacilityItem } from '../../../types/cms'

export default function FacilitiesManagementTab() {
  const { data, addFacility, updateFacility, deleteFacility } = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<FacilityItem, 'id'>>({
    title: '',
    desc: '',
    tag: 'Fasilitas Utama',
    icon: 'mosque',
  })

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      title: '',
      desc: '',
      tag: 'Fasilitas Utama',
      icon: 'mosque',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (f: FacilityItem) => {
    setEditingId(f.id)
    setFormData({
      title: f.title,
      desc: f.desc,
      tag: f.tag,
      icon: f.icon,
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingId) {
      updateFacility(editingId, formData)
    } else {
      addFacility(formData)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* FASILITAS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Fasilitas Kampus</h3>
            <p className="text-xs text-ink-mute">Kelola sarana dan prasarana belajar ramah anak</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-light"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Fasilitas</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.facilities.map((fac) => (
            <div
              key={fac.id}
              className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-white p-5 shadow-soft transition-all hover:border-primary/25 hover:shadow-lift"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
                    <Building className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-ink-soft">
                    {fac.tag}
                  </span>
                </div>
                <h4 className="font-heading text-sm font-extrabold text-primary">{fac.title}</h4>
                <p className="text-xs text-ink-mute leading-relaxed">{fac.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-primary/5 pt-3">
                <button
                  type="button"
                  onClick={() => openEditModal(fac)}
                  className="flex items-center gap-1 rounded-lg border border-primary/15 bg-cream/50 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white"
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteFacility(fac.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-softred/20 text-warmred hover:bg-warmred hover:text-white"
                  title="Hapus"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 PILAR KARAKTER PREVIEW */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="border-b border-primary/5 pb-4">
          <h3 className="font-heading text-base font-extrabold text-primary">7 Pilar Karakter Unggulan Al-Mustam</h3>
          <p className="text-xs text-ink-mute">Pilar pendidikan karakter yang tertanam di seluruh kurikulum</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.pillars.map((p) => (
            <div key={p.number} className="rounded-2xl border border-primary/5 bg-cream/40 p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-gold-ink">{p.number}</span>
                <h5 className="font-heading text-xs font-bold text-primary">{p.title}</h5>
              </div>
              <p className="mt-1 text-[11px] text-ink-mute leading-relaxed line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT FASILITAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {editingId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
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
                <label className="mb-1 block text-xs font-bold text-ink">Nama Fasilitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang Sentra Sains & Kreativitas"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Kategori / Tag</label>
                <input
                  type="text"
                  placeholder="Contoh: Fasilitas Utama / Motorik / Spiritual"
                  value={formData.tag}
                  onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Deskripsi Fasilitas</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi sarana, AC, kenyamanan, atau keunggulan fasilitas..."
                  value={formData.desc}
                  onChange={(e) => setFormData((p) => ({ ...p, desc: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
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
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
