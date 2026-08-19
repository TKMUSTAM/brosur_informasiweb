import { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Eye,
  Trash2,
  Phone,
  X,
} from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { PPDBApplicant } from '../../../types/cms'

const STATUSES: PPDBApplicant['status'][] = ['Baru', 'Verifikasi', 'Wawancara', 'Diterima', 'Ditolak']

export default function PPDBManagementTab() {
  const { data, updatePPDBApplicantStatus, deletePPDBApplicant, updatePPDBBatch } = useCMS()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Semua')
  const [programFilter, setProgramFilter] = useState<string>('Semua')

  // Detail Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<PPDBApplicant | null>(null)

  const filteredApplicants = useMemo(() => {
    return data.ppdbApplicants.filter((app) => {
      const matchSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toLowerCase().includes(search.toLowerCase()) ||
        (app.whatsapp && app.whatsapp.includes(search))
      const matchStatus = statusFilter === 'Semua' || app.status === statusFilter
      const matchProgram = programFilter === 'Semua' || app.program === programFilter
      return matchSearch && matchStatus && matchProgram
    })
  }, [data.ppdbApplicants, search, statusFilter, programFilter])

  const exportCSV = () => {
    const headers = ['ID', 'Nama Anak', 'Program', 'Jalur', 'WhatsApp', 'Tanggal Daftar', 'Status', 'Alamat']
    const rows = data.ppdbApplicants.map((a) => [
      `"${a.id}"`,
      `"${a.name}"`,
      `"${a.program}"`,
      `"${a.track}"`,
      `"${a.whatsapp}"`,
      `"${a.date}"`,
      `"${a.status}"`,
      `"${a.address || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `data_pendaftar_ppdb_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: PPDBApplicant['status']) => {
    switch (status) {
      case 'Diterima':
        return 'bg-softgreen text-primary'
      case 'Wawancara':
        return 'bg-softyellow text-gold-ink'
      case 'Verifikasi':
        return 'bg-softblue text-secondary-dark'
      case 'Baru':
        return 'bg-softred text-warmred-dark'
      case 'Ditolak':
        return 'bg-cream text-ink-mute'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & GELOMBANG PPDB */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-primary/5 pb-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-heading text-lg font-extrabold text-primary">Manajemen Gelombang PPDB 2026/2027</h3>
            <p className="text-xs text-ink-mute">Atur status pembukaan pendaftaran dan kuota per gelombang</p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-cream/70 px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {data.ppdbBatches.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 transition-all ${
                b.isActive
                  ? 'border-primary bg-softgreen/30 shadow-soft'
                  : 'border-primary/10 bg-cream/30 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-extrabold text-primary">{b.name}</span>
                <button
                  type="button"
                  onClick={() => updatePPDBBatch(b.id, { isActive: !b.isActive })}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    b.isActive ? 'bg-primary text-white' : 'bg-ink-mute/20 text-ink-mute'
                  }`}
                >
                  {b.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-ink-mute">{b.period}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-bold">
                <span className="text-ink-mute">Terisi / Kuota:</span>
                <span className="text-primary">{b.filled} / {b.quota}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama siswa, no. pendaftaran, atau WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-primary/15 bg-white px-4 py-3 pl-11 text-sm text-ink outline-none shadow-soft focus:border-primary"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        </div>

        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="rounded-2xl border border-primary/15 bg-white px-4 py-3 text-xs font-bold text-ink outline-none shadow-soft focus:border-primary"
        >
          <option value="Semua">Semua Program</option>
          <option value="KB">KB / Playgroup</option>
          <option value="TK A">TK A</option>
          <option value="TK B">TK B</option>
          <option value="TPA">TPA</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-primary/15 bg-white px-4 py-3 text-xs font-bold text-ink outline-none shadow-soft focus:border-primary"
        >
          <option value="Semua">Semua Status</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* TABEL PENDAFTAR */}
      <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft">
        <div className="border-b border-primary/5 px-6 py-4 flex items-center justify-between">
          <h4 className="font-heading text-sm font-extrabold text-primary">
            Daftar Calon Siswa ({filteredApplicants.length} Pendaftar)
          </h4>
        </div>

        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-primary/5 bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-ink-mute">
                <th className="px-6 py-3.5">No. Daftar</th>
                <th className="px-6 py-3.5">Nama Calon Siswa</th>
                <th className="px-6 py-3.5">Jenjang</th>
                <th className="px-6 py-3.5">Tanggal</th>
                <th className="px-6 py-3.5">Ubah Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs font-bold text-ink-mute">
                    Tidak ada pendaftar yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="transition-colors hover:bg-cream/40">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{app.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-ink">{app.name}</p>
                      <p className="text-[11px] text-ink-mute">{app.track}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-softgreen px-2 py-0.5 text-xs font-bold text-primary">
                        {app.program}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-mute">{app.date}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updatePPDBApplicantStatus(app.id, e.target.value as PPDBApplicant['status'])}
                        className={`rounded-full px-3 py-1 text-xs font-bold outline-none cursor-pointer ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.whatsapp && (
                          <a
                            href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Assalamualaikum Bapak/Ibu wali murid dari ${app.name}, perihal pendaftaran PPDB TK Al-Mustam (${app.id})...`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-softgreen text-primary hover:bg-primary hover:text-white"
                            title="Kirim Pesan WhatsApp"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-cream text-primary hover:bg-primary hover:text-white"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePPDBApplicant(app.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-softred/20 text-warmred hover:bg-warmred hover:text-white"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL PENDAFTAR */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{selectedApplicant.id}</span>
                <h3 className="font-heading text-lg font-extrabold text-ink">{selectedApplicant.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink-mute hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-cream/60 p-4">
                <div>
                  <p className="text-ink-mute font-medium">Program Pilihan</p>
                  <p className="font-bold text-ink mt-0.5">{selectedApplicant.program}</p>
                </div>
                <div>
                  <p className="text-ink-mute font-medium">Jalur Pendaftaran</p>
                  <p className="font-bold text-ink mt-0.5">{selectedApplicant.track}</p>
                </div>
                <div>
                  <p className="text-ink-mute font-medium">Status Pendaftaran</p>
                  <p className="font-bold text-primary mt-0.5">{selectedApplicant.status}</p>
                </div>
                <div>
                  <p className="text-ink-mute font-medium">Tanggal Masuk</p>
                  <p className="font-bold text-ink mt-0.5">{selectedApplicant.date}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/10 p-4 space-y-2">
                <p className="font-bold text-primary uppercase tracking-wider text-[10px]">Kontak & Alamat</p>
                <p>
                  <strong className="text-ink">WhatsApp:</strong> {selectedApplicant.whatsapp || '-'}
                </p>
                <p>
                  <strong className="text-ink">Alamat:</strong> {selectedApplicant.address || '-'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-primary/5 pt-4">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-soft"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
