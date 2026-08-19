import { useState } from 'react'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { TeacherItem } from '../../../types/cms'

export default function TeachersManagementTab() {
  const { data, addTeacher, updateTeacher, deleteTeacher } = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<TeacherItem, 'id'>>({
    name: '',
    role: '',
    note: '',
    education: 'S1 PAUD',
  })

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
      role: '',
      note: '',
      education: 'S1 PAUD',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (t: TeacherItem) => {
    setEditingId(t.id)
    setFormData({
      name: t.name,
      role: t.role,
      note: t.note,
      education: t.education || 'S1 PAUD',
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.role.trim()) return

    if (editingId) {
      updateTeacher(editingId, formData)
    } else {
      addTeacher(formData)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Guru & Tenaga Kependidikan</h3>
          <p className="text-xs text-ink-mute">Kelola jajaran pimpinan, ustadzah, dan konselor anak</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Guru / Staf</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.teachers.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-white p-5 shadow-soft transition-all hover:border-primary/25 hover:shadow-lift"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen font-heading text-sm font-black text-primary">
                  {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-ink-soft">
                  {t.education}
                </span>
              </div>
              <div>
                <h4 className="font-heading text-sm font-extrabold text-primary">{t.name}</h4>
                <p className="text-xs font-semibold text-gold-ink">{t.role}</p>
              </div>
              <p className="text-xs text-ink-mute leading-relaxed">{t.note}</p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-primary/5 pt-3">
              <button
                type="button"
                onClick={() => openEditModal(t)}
                className="flex items-center gap-1 rounded-lg border border-primary/15 bg-cream/50 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white"
              >
                <Edit3 className="h-3 w-3" /> Edit
              </button>
              <button
                type="button"
                onClick={() => deleteTeacher(t.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-warmred/20 bg-softred/20 text-warmred hover:bg-warmred hover:text-white"
                title="Hapus"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH/EDIT GURU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {editingId ? 'Edit Profil Guru / Staf' : 'Tambah Tenaga Pendidik'}
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
                <label className="mb-1 block text-xs font-bold text-ink">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadzah Siti Maryam, S.Pd. PAUD"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Jabatan / Peran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kepala Sekolah TK / Guru Sentra Imtaq"
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Kualifikasi Pendidikan</label>
                <input
                  type="text"
                  placeholder="Contoh: S1 PAUD Universitas Negeri"
                  value={formData.education || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, education: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Keahlian / Catatan Pengalaman</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Praktisi PAUD 8 Tahun, Asesor Akreditasi..."
                  value={formData.note}
                  onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
