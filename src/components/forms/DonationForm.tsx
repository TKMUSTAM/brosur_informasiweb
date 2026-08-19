import { useState } from 'react'
import { Check, Lock, ShieldCheck, BadgeCheck } from 'lucide-react'
import Icon from '../Icon'
import { Button } from '../Buttons'
import { donationAmounts, donationPrograms } from '../../data/donations'
import { formatRupiah } from '../../lib/format'

export default function DonationForm() {
  const [amount, setAmount] = useState<number | 'custom'>(100000)
  const [customAmount, setCustomAmount] = useState('')
  const [program, setProgram] = useState('pendidikan-yatim')
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const selectedProgram = donationPrograms.find((p) => p.slug === program)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = amount === 'custom' ? Number(customAmount.replace(/\D/g, '')) : amount
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.whatsapp.trim()) errs.whatsapp = 'Nomor WhatsApp wajib diisi'
    if (!finalAmount || finalAmount < 10000) errs.amount = 'Nominal minimal Rp 10.000'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-card-lg bg-white p-10 text-center shadow-lift">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-softgreen">
          <Check className="h-10 w-10 text-primary" strokeWidth={3} />
        </span>
        <h3 className="font-heading text-2xl font-extrabold text-primary">Jazakumullahu Khairan!</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Terima kasih, <strong>{form.name}</strong>. Niat baik Anda telah kami terima untuk program{' '}
          <strong>{selectedProgram?.name}</strong> sebesar <strong>{formatRupiah(amount === 'custom' ? Number(customAmount.replace(/\D/g, '')) : amount)}</strong>.
        </p>
        <div className="rounded-xl bg-softyellow px-5 py-3 text-sm font-bold text-gold-ink">
          Konfirmasi pembayaran akan kami kirim melalui WhatsApp
        </div>
        <p className="text-xs text-ink-mute">Catatan: halaman ini adalah demonstrasi UI. Integrasi payment gateway dapat ditambahkan.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-card-lg bg-white p-7 shadow-lift sm:p-9" noValidate>
      <h2 className="font-heading text-xl font-extrabold text-primary">Form Donasi</h2>

      {/* nominal */}
      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-ink">Pilih Nominal</legend>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {donationAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              className={`rounded-xl border-2 px-3 py-3.5 text-sm font-extrabold transition-all ${
                amount === a
                  ? 'border-primary bg-softgreen text-primary shadow-soft'
                  : 'border-primary/10 bg-cream text-ink-soft hover:border-primary/30'
              }`}
              aria-pressed={amount === a}
            >
              {formatRupiah(a)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount('custom')}
            className={`rounded-xl border-2 px-3 py-3.5 text-sm font-extrabold transition-all ${
              amount === 'custom'
                ? 'border-primary bg-softgreen text-primary shadow-soft'
                : 'border-primary/10 bg-cream text-ink-soft hover:border-primary/30'
            }`}
            aria-pressed={amount === 'custom'}
          >
            Nominal Lain
          </button>
        </div>
        {amount === 'custom' && (
          <div className="mt-3">
            <label htmlFor="custom-amount" className="sr-only">Nominal donasi lain</label>
            <input
              id="custom-amount"
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Masukkan nominal, mis. 150000"
              className="w-full rounded-xl border-2 border-primary/15 bg-cream px-4 py-3.5 text-sm font-bold text-ink outline-none transition-colors focus:border-primary"
            />
            {errors.amount && <p className="mt-1.5 text-xs font-semibold text-warmred">{errors.amount}</p>}
          </div>
        )}
      </fieldset>

      {/* program */}
      <fieldset className="mt-7">
        <legend className="text-sm font-bold text-ink">Pilih Program</legend>
        <div className="mt-3 space-y-2.5">
          {donationPrograms.map((p) => (
            <label
              key={p.slug}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3.5 transition-all ${
                program === p.slug
                  ? 'border-primary bg-softgreen shadow-soft'
                  : 'border-primary/10 bg-cream hover:border-primary/30'
              }`}
            >
              <input type="radio" name="program" value={p.slug} checked={program === p.slug} onChange={() => setProgram(p.slug)} className="sr-only" />
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-soft">
                <Icon name={p.icon} className="h-4.5 w-4.5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-extrabold text-primary">{p.name}</span>
                <span className="text-xs leading-relaxed text-ink-soft">{p.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* data diri */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="don-name" className="mb-1.5 block text-sm font-bold text-ink">Nama Lengkap</label>
          <input
            id="don-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama Anda"
            className={`w-full rounded-xl border-2 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary ${errors.name ? 'border-warmred' : 'border-primary/10'}`}
          />
          {errors.name && <p className="mt-1.5 text-xs font-semibold text-warmred">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="don-wa" className="mb-1.5 block text-sm font-bold text-ink">Nomor WhatsApp</label>
          <input
            id="don-wa"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="08xxxxxxxxxx"
            className={`w-full rounded-xl border-2 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary ${errors.whatsapp ? 'border-warmred' : 'border-primary/10'}`}
          />
          {errors.whatsapp && <p className="mt-1.5 text-xs font-semibold text-warmred">{errors.whatsapp}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="don-email" className="mb-1.5 block text-sm font-bold text-ink">Email (opsional)</label>
          <input
            id="don-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@contoh.com"
            className="w-full rounded-xl border-2 border-primary/10 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" className="mt-7 w-full">
        <Icon name="heart" className="h-5 w-5" /> Donasi Sekarang
      </Button>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-mute">
        <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Data terenkripsi</span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Transaksi aman</span>
        <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> Laporan transparan</span>
      </div>
    </form>
  )
}
