import { useState } from 'react'
import { Save, Building2, Phone, Share2, KeyRound, Landmark } from 'lucide-react'
import { useCMS } from '../../../hooks/useCMS'
import type { SiteData } from '../../../types/cms'

export default function SiteSettingsTab() {
  const { data, updateSite } = useCMS()
  const [form, setForm] = useState<SiteData>(data.site)
  const [usernameInput, setUsernameInput] = useState(data.site.adminUsername || 'admin')
  const [passwordInput, setPasswordInput] = useState(data.site.adminPassword || 'admin123')
  const [pinInput, setPinInput] = useState(data.site.adminPin || '123456')

  const handleChange = (field: keyof SiteData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const handleSocialChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }))
  }

  const handleBankChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      bank: { ...prev.bank, [field]: value },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSite({
      ...form,
      adminUsername: usernameInput.trim() || 'admin',
      adminPassword: passwordInput || 'admin123',
      adminPin: pinInput || '123456',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* IDENTITAS LEMBAGA */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-heading text-base font-extrabold text-primary">Identitas & Legalitas Yayasan</h3>
            <p className="text-xs text-ink-mute">Informasi profil nama, akreditasi, dan nomor izin operasional</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-ink">Nama Lengkap Yayasan & TK</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Nama Singkat / Brand</label>
            <input
              type="text"
              value={form.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Nama Badan Hukum (Yayasan)</label>
            <input
              type="text"
              value={form.legalName}
              onChange={(e) => handleChange('legalName', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-ink">Tagline Utama</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-ink">Deskripsi Profil Singkat</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Status Akreditasi</label>
            <input
              type="text"
              value={form.accreditation}
              onChange={(e) => handleChange('accreditation', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Nomor Pokok Sekolah Nasional (NPSN)</label>
            <input
              type="text"
              value={form.npsn}
              onChange={(e) => handleChange('npsn', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">SK Kemenkumham RI</label>
            <input
              type="text"
              value={form.skKemenkumham}
              onChange={(e) => handleChange('skKemenkumham', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Nomor Izin Operasional</label>
            <input
              type="text"
              value={form.izinOperasional}
              onChange={(e) => handleChange('izinOperasional', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* KONTAK & ALAMAT */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-heading text-base font-extrabold text-primary">Kontak & Alamat Kampus</h3>
            <p className="text-xs text-ink-mute">Nomor layanan WhatsApp, Telepon, dan Alamat Lengkap</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Nomor WhatsApp Resmi (Format: 628xxx)</label>
            <input
              type="text"
              value={form.contact.whatsapp}
              onChange={(e) => handleContactChange('whatsapp', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Tampilan WhatsApp (Contoh: 0812-3456-7890)</label>
            <input
              type="text"
              value={form.contact.whatsappDisplay}
              onChange={(e) => handleContactChange('whatsappDisplay', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Email Informasi Umum</label>
            <input
              type="email"
              value={form.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Telepon Kantor</label>
            <input
              type="text"
              value={form.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-ink">Alamat Lengkap</label>
            <input
              type="text"
              value={form.contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Jam Operasional Kantor</label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">Jam Belajar Siswa</label>
            <input
              type="text"
              value={form.schoolHours}
              onChange={(e) => handleChange('schoolHours', e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* REKENING BANK & SOSIAL MEDIA */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* REKENING */}
        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-extrabold text-primary">Rekening Bank Yayasan</h3>
              <p className="text-xs text-ink-mute">Rekening resmi penerimaan donasi dan PPDB</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink">Nama Bank</label>
              <input
                type="text"
                value={form.bank?.bankName || ''}
                onChange={(e) => handleBankChange('bankName', e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink">Nomor Rekening</label>
              <input
                type="text"
                value={form.bank?.accountNumber || ''}
                onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-mono font-bold text-ink outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink">Atas Nama (Rekening)</label>
              <input
                type="text"
                value={form.bank?.accountHolder || ''}
                onChange={(e) => handleBankChange('accountHolder', e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* SOSMED & KEAMANAN */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softgreen text-primary">
                <Share2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-extrabold text-primary">Media Sosial</h3>
                <p className="text-xs text-ink-mute">Link kanal resmi Instagram, Facebook, YouTube</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">Instagram URL</label>
                <input
                  type="text"
                  value={form.social.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">Facebook URL</label>
                <input
                  type="text"
                  value={form.social.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">YouTube URL</label>
                <input
                  type="text"
                  value={form.social.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softyellow text-gold-ink">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-extrabold text-primary">Akun Login & Keamanan Admin</h3>
                <p className="text-xs text-ink-mute">Atur username dan password untuk masuk ke portal CMS ini</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">Username Admin</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">Password Admin Baru</label>
                <input
                  type="text"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink">PIN Cadangan (6 Digit)</label>
                <input
                  type="text"
                  maxLength={8}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full rounded-xl border border-primary/15 bg-cream/40 px-4 py-3 text-sm font-mono font-bold tracking-widest text-ink outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-white shadow-lift transition-all hover:bg-primary-light hover:scale-105 active:scale-95"
        >
          <Save className="h-5 w-5" />
          <span>Simpan Seluruh Pengaturan</span>
        </button>
      </div>
    </form>
  )
}
