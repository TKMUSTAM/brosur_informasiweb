import { useState } from 'react'
import { Heart, HandCoins, Plus, Trash2, Edit3, X } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { OrphanBeneficiary, DonationItem } from '../../../types/cms'
import { formatRupiah } from '../../../lib/format'

export default function DonasiManagementTab() {
  const {
    data,
    addOrphan,
    updateOrphan,
    deleteOrphan,
    addDonation,
    updateDonationStatus,
  } = useCMS()

  const [activeSubTab, setActiveSubTab] = useState<'yatim' | 'donasi'>('yatim')

  // Orphan modal state
  const [isOrphanModalOpen, setIsOrphanModalOpen] = useState(false)
  const [editingOrphanId, setEditingOrphanId] = useState<string | null>(null)
  const [orphanForm, setOrphanForm] = useState<Omit<OrphanBeneficiary, 'id'>>({
    name: '',
    age: 6,
    grade: 'TK A',
    gender: 'Laki-laki',
    monthlyNeed: 400000,
    status: 'Menunggu Wali Asuh',
    guardian: '',
  })

  // Donation modal state
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [donationForm, setDonationForm] = useState<Omit<DonationItem, 'id' | 'date'>>({
    donor: '',
    program: 'Pendidikan Yatim',
    amount: 500000,
    status: 'Terkumpul',
  })

  const totalDonation = data.donations.reduce((sum, d) => sum + d.amount, 0)
  const totalOrphans = data.orphans.length
  const activeSupported = data.orphans.filter((o) => o.status === 'Aktif Terbantu').length

  const openAddOrphan = () => {
    setEditingOrphanId(null)
    setOrphanForm({
      name: '',
      age: 6,
      grade: 'TK A',
      gender: 'Laki-laki',
      monthlyNeed: 400000,
      status: 'Menunggu Wali Asuh',
      guardian: '',
    })
    setIsOrphanModalOpen(true)
  }

  const openEditOrphan = (o: OrphanBeneficiary) => {
    setEditingOrphanId(o.id)
    setOrphanForm({
      name: o.name,
      age: o.age,
      grade: o.grade,
      gender: o.gender,
      monthlyNeed: o.monthlyNeed,
      status: o.status,
      guardian: o.guardian || '',
    })
    setIsOrphanModalOpen(true)
  }

  const handleSaveOrphan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orphanForm.name.trim()) return

    if (editingOrphanId) {
      updateOrphan(editingOrphanId, orphanForm)
    } else {
      addOrphan(orphanForm)
    }
    setIsOrphanModalOpen(false)
  }

  const handleSaveDonation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!donationForm.donor.trim()) return
    addDonation(donationForm)
    setIsDonationModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* STATS HEADER */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
              <Heart className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-softgreen px-2.5 py-0.5 text-xs font-bold text-primary">
              {activeSupported} Terbantu
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl font-black text-primary">{totalOrphans} Anak</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Santri Yatim Binaan</p>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softyellow text-gold-ink">
              <HandCoins className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-softyellow px-2.5 py-0.5 text-xs font-bold text-gold-ink">
              {data.donations.length} Transaksi
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl font-black text-primary">{formatRupiah(totalDonation)}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Total Donasi Masuk</p>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft flex flex-col justify-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('yatim')}
              className={`flex-1 rounded-xl py-3 text-xs font-bold transition-all ${
                activeSubTab === 'yatim' ? 'bg-primary text-white shadow-soft' : 'bg-cream text-ink'
              }`}
            >
              Data Santri Yatim
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('donasi')}
              className={`flex-1 rounded-xl py-3 text-xs font-bold transition-all ${
                activeSubTab === 'donasi' ? 'bg-primary text-white shadow-soft' : 'bg-cream text-ink'
              }`}
            >
              Riwayat Donasi
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB: SANTRI YATIM */}
      {activeSubTab === 'yatim' && (
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Daftar Santri Yatim & Beasiswa</h3>
              <p className="text-xs text-ink-mute">Kelola data anak asuh yang didanai beasiswa pendidikan</p>
            </div>
            <button
              type="button"
              onClick={openAddOrphan}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Santri Yatim</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.orphans.map((o) => (
              <div
                key={o.id}
                className="flex flex-col justify-between rounded-3xl border border-primary/10 bg-white p-5 shadow-soft transition-all hover:border-primary/25 hover:shadow-lift"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        o.status === 'Aktif Terbantu'
                          ? 'bg-softgreen text-primary'
                          : o.status === 'Menunggu Wali Asuh'
                          ? 'bg-softyellow text-gold-ink'
                          : 'bg-cream text-ink-mute'
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="text-[11px] font-bold text-ink-mute">{o.gender}</span>
                  </div>

                  <div>
                    <h4 className="font-heading text-base font-extrabold text-ink">{o.name}</h4>
                    <p className="text-xs text-ink-mute">{o.grade}</p>
                  </div>

                  <div className="rounded-xl bg-cream/70 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-mute">Kebutuhan Bulanan</p>
                    <p className="font-heading text-sm font-extrabold text-primary">
                      {formatRupiah(o.monthlyNeed)} / bulan
                    </p>
                    {o.guardian && (
                      <p className="mt-1 text-[11px] text-ink-soft">
                        <strong>Wali Asuh:</strong> {o.guardian}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-primary/5 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditOrphan(o)}
                    className="flex items-center gap-1 rounded-lg border border-primary/15 bg-cream/50 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteOrphan(o.id)}
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
      )}

      {/* SUB-TAB: RIWAYAT DONASI */}
      {activeSubTab === 'donasi' && (
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-lg font-extrabold text-primary">Pencatatan Donasi Masuk</h3>
              <p className="text-xs text-ink-mute">Rekap donatur dan transparansi program sedekah</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDonationModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Donasi Baru</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft">
            <div className="thin-scroll overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-primary/5 bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-ink-mute">
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-6 py-3.5">Nama Donatur</th>
                    <th className="px-6 py-3.5">Program</th>
                    <th className="px-6 py-3.5">Nominal</th>
                    <th className="px-6 py-3.5">Tanggal</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {data.donations.map((d) => (
                    <tr key={d.id} className="hover:bg-cream/40">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{d.id}</td>
                      <td className="px-6 py-4 font-semibold text-ink">{d.donor}</td>
                      <td className="px-6 py-4 text-xs font-medium text-ink-soft">{d.program}</td>
                      <td className="px-6 py-4 font-bold text-primary">{formatRupiah(d.amount)}</td>
                      <td className="px-6 py-4 text-xs text-ink-mute">{d.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={d.status}
                          onChange={(e) => updateDonationStatus(d.id, e.target.value as DonationItem['status'])}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold outline-none cursor-pointer ${
                            d.status === 'Tersalur' ? 'bg-softgreen text-primary' : 'bg-softblue text-secondary-dark'
                          }`}
                        >
                          <option value="Terkumpul">Terkumpul</option>
                          <option value="Tersalur">Tersalur</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT ORPHAN */}
      {isOrphanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {editingOrphanId ? 'Edit Data Santri Yatim' : 'Tambah Santri Yatim Binaan'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOrphanModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink-mute hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrphan} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Nama Anak (atau Inisial)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ananda Rizki (8 Th)"
                  value={orphanForm.name}
                  onChange={(e) => setOrphanForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Usia & Jenjang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TK A / Playgroup"
                    value={orphanForm.grade}
                    onChange={(e) => setOrphanForm((p) => ({ ...p, grade: e.target.value }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Jenis Kelamin</label>
                  <select
                    value={orphanForm.gender}
                    onChange={(e) => setOrphanForm((p) => ({ ...p, gender: e.target.value as any }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Kebutuhan SPP/Gizi Bulanan (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    step={25000}
                    value={orphanForm.monthlyNeed}
                    onChange={(e) => setOrphanForm((p) => ({ ...p, monthlyNeed: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-ink">Status Beasiswa</label>
                  <select
                    value={orphanForm.status}
                    onChange={(e) => setOrphanForm((p) => ({ ...p, status: e.target.value as any }))}
                    className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  >
                    <option value="Aktif Terbantu">Aktif Terbantu</option>
                    <option value="Menunggu Wali Asuh">Menunggu Wali Asuh</option>
                    <option value="Lulus">Lulus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Nama Wali Asuh (Opsional)</label>
                <input
                  type="text"
                  placeholder="Nama donatur wali asuh jika ada"
                  value={orphanForm.guardian || ''}
                  onChange={(e) => setOrphanForm((p) => ({ ...p, guardian: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOrphanModalOpen(false)}
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

      {/* MODAL TAMBAH DONASI */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-deep/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="font-heading text-lg font-extrabold text-primary">Catat Donasi Masuk</h3>
              <button
                type="button"
                onClick={() => setIsDonationModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink-mute hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDonation} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Nama Donatur</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hamba Allah / Bapak Fajar"
                  value={donationForm.donor}
                  onChange={(e) => setDonationForm((p) => ({ ...p, donor: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Program Donasi</label>
                <select
                  value={donationForm.program}
                  onChange={(e) => setDonationForm((p) => ({ ...p, program: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                >
                  <option value="Pendidikan Yatim">Pendidikan Yatim</option>
                  <option value="Beasiswa">Beasiswa</option>
                  <option value="Makanan Anak">Makanan Anak</option>
                  <option value="Fasilitas Sekolah">Fasilitas Sekolah</option>
                  <option value="Bebas">Bebas / Sedekah Umum</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink">Nominal Donasi (Rupiah)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDonationModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink-mute hover:bg-cream"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-white shadow-soft hover:bg-primary-light"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
