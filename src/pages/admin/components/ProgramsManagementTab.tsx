import { useState } from 'react'
import { Edit3, Check, Clock, Users, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { ProgramItem } from '../../../types/cms'
import { formatRupiah } from '../../../lib/format'

export default function ProgramsManagementTab() {
  const { data, updateProgram } = useCMS()
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null)
  const [formData, setFormData] = useState<Partial<ProgramItem>>({})

  const handleEdit = (p: ProgramItem) => {
    setEditingProgram(p)
    setFormData({
      name: p.name,
      subtitle: p.subtitle,
      age: p.age,
      schedule: p.schedule,
      capacity: p.capacity,
      ratio: p.ratio,
      description: p.description,
      monthlyFee: p.monthlyFee || 300000,
      entryFee: p.entryFee || 3000000,
      highlights: [...p.highlights],
    })
  }

  const handleHighlightChange = (idx: number, val: string) => {
    const arr = [...(formData.highlights || [])]
    arr[idx] = val
    setFormData((prev) => ({ ...prev, highlights: arr }))
  }

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ''],
    }))
  }

  const removeHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProgram) return

    const cleanedHighlights = (formData.highlights || []).filter((h) => h.trim().length > 0)
    updateProgram(editingProgram.slug, {
      ...formData,
      highlights: cleanedHighlights.length > 0 ? cleanedHighlights : editingProgram.highlights,
    })
    setEditingProgram(null)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Program Pendidikan & Biaya</h3>
          <p className="text-xs text-ink-mute">
            Kelola jenjang KB, TK A, TK B, dan TPA beserta tarif SPP dan kurikulum
          </p>
        </div>
      </div>

      {/* PROGRAM CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {data.programs.map((prog) => (
          <div
            key={prog.slug}
            className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all hover:border-primary/25 hover:shadow-lift"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen font-heading text-sm font-black text-primary">
                  {prog.code}
                </span>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink-soft">
                  {prog.age}
                </span>
              </div>

              <div>
                <h4 className="font-heading text-base font-extrabold text-primary">{prog.name}</h4>
                <p className="text-xs text-ink-mute">{prog.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-cream/70 p-3.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-mute">SPP Bulanan</p>
                  <p className="font-heading text-sm font-extrabold text-primary">
                    {formatRupiah(prog.monthlyFee || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-mute">Uang Pangkal</p>
                  <p className="font-heading text-sm font-extrabold text-primary">
                    {formatRupiah(prog.entryFee || 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-ink-soft">
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {prog.schedule}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-primary" /> {prog.capacity} ({prog.ratio})
                </p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-mute">Fitur Unggulan:</p>
                <ul className="space-y-1">
                  {prog.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-1">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-primary/5 pt-4">
              <button
                type="button"
                onClick={() => handleEdit(prog)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cream py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Info Program & Biaya</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT PROGRAM */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                Edit Program: {editingProgram.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProgram(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink-mute hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Nama Jenjang / Kelas</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Rentang Usia</label>
                  <input
                    type="text"
                    required
                    value={formData.age || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Sub-judul / Tagline Program</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              {/* BIAYA */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">SPP Bulanan (Rupiah)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.monthlyFee || 0}
                    onChange={(e) => setFormData((p) => ({ ...p, monthlyFee: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Uang Pangkal Masuk (Rupiah)</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={formData.entryFee || 0}
                    onChange={(e) => setFormData((p) => ({ ...p, entryFee: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Jadwal Belajar</label>
                  <input
                    type="text"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, schedule: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Kapasitas & Rasio Guru</label>
                  <input
                    type="text"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, capacity: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Deskripsi Program</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              {/* HIGHLIGHTS */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-ink">Poin-poin Keunggulan Kurikulum</label>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Tambah Poin
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.highlights || []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleHighlightChange(i, e.target.value)}
                        placeholder={`Keunggulan ${i + 1}`}
                        className="w-full rounded-xl border border-primary/15 bg-cream/40 px-3.5 py-2 text-sm text-ink outline-none focus:border-primary"
                      />
                      {(formData.highlights || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(i)}
                          className="text-ink-mute hover:text-warmred p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProgram(null)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink-mute hover:bg-cream"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-white shadow-soft hover:bg-primary-light"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
