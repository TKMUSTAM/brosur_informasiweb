import { useState, useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'

export default function DataBackupTab() {
  const { data, exportBackup, importBackup, resetToDefaults } = useCMS()
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        importBackup(content)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleReset = () => {
    resetToDefaults()
    setConfirmReset(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="border-b border-primary/5 pb-4">
          <h3 className="font-heading text-lg font-extrabold text-primary">Backup, Restore & Sinkronisasi CMS</h3>
          <p className="text-xs text-ink-mute">
            Amankan seluruh data website dengan mengekspor file cadangan JSON atau pulihkan data kapan saja.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* EXPORT BACKUP */}
          <div className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-cream/40 p-6">
            <div className="space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary shadow-soft">
                <Download className="h-6 w-6" />
              </span>
              <h4 className="font-heading text-base font-extrabold text-primary">Unduh Backup Data (JSON)</h4>
              <p className="text-xs text-ink-mute leading-relaxed">
                Menyimpan seluruh konfigurasi nama yayasan, nomor rekening, daftar berita, program, guru, foto galeri,
                dan data calon siswa PPDB ke dalam satu file berkas JSON lokal.
              </p>
            </div>
            <button
              type="button"
              onClick={exportBackup}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-bold text-white shadow-soft transition-all hover:bg-primary-light hover:shadow-lift"
            >
              <Download className="h-4 w-4" />
              <span>Unduh File Cadangan (.json)</span>
            </button>
          </div>

          {/* IMPORT RESTORE */}
          <div className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-cream/40 p-6">
            <div className="space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-gold-ink shadow-soft">
                <Upload className="h-6 w-6" />
              </span>
              <h4 className="font-heading text-base font-extrabold text-primary">Pulihkan Data dari Backup</h4>
              <p className="text-xs text-ink-mute leading-relaxed">
                Unggah file JSON backup yang pernah Anda unduh sebelumnya untuk mengembalikan seluruh konten website
                ke status cadangan tersebut.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="upload-cms-backup"
              />
              <label
                htmlFor="upload-cms-backup"
                className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 bg-white py-3.5 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-softgreen/30"
              >
                <Upload className="h-4 w-4" />
                <span>Pilih File Backup (.json)</span>
              </label>
            </div>
          </div>
        </div>

        {/* RESET FACTORY DEFAULTS */}
        <div className="mt-8 rounded-3xl border border-warmred/20 bg-softred/10 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-heading text-base font-extrabold text-warmred-dark flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warmred" /> Reset ke Pengaturan Awal (Default)
              </h4>
              <p className="mt-1 text-xs text-ink-mute leading-relaxed">
                Kembalikan seluruh konten website ke data template awal Al-Mustam bawaan sistem. Data kustomisasi akan
                dihapus dari peramban ini.
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded-2xl border border-warmred/30 bg-white px-6 py-3 text-xs font-bold text-warmred transition-colors hover:bg-warmred hover:text-white shrink-0"
              >
                Reset Semua Data
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-ink"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl bg-warmred px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-warmred-dark"
                >
                  Yakin, Reset Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SYSTEM STATUS STATS */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
        <h4 className="font-heading text-sm font-extrabold text-primary mb-3">Status Sistem Penyimpanan CMS</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-cream p-3">
            <p className="text-ink-mute font-medium">Mode Penyimpanan</p>
            <p className="font-bold text-primary mt-0.5">LocalStorage + Reaktif</p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <p className="text-ink-mute font-medium">Total Artikel Berita</p>
            <p className="font-bold text-primary mt-0.5">{data.news.length} Artikel</p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <p className="text-ink-mute font-medium">Total Calon Siswa</p>
            <p className="font-bold text-primary mt-0.5">{data.ppdbApplicants.length} Pendaftar</p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <p className="text-ink-mute font-medium">Terakhir Diperbarui</p>
            <p className="font-bold text-primary mt-0.5">
              {new Date(data.lastUpdated).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
