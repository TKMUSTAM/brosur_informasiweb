import { useState } from 'react'
import { Check, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { Button } from '../components/Buttons'
import { useSEO } from '../hooks/useSEO'
import { site } from '../data/site'

export default function Kontak() {
  useSEO({
    title: `Hubungi Kami — ${site.name}`,
    description: `Kontak resmi ${site.name}: alamat kampus, WhatsApp PPDB, email, dan peta lokasi Google Maps.`,
    path: '/kontak',
  })

  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', whatsapp: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.message.trim()) errs.message = 'Pesan wajib diisi'
    setErrors(errs)
    if (Object.keys(errs).length === 0) setSent(true)
  }

  const contactCards = [
    { icon: MapPin, title: 'Alamat Kampus', value: site.contact.address, href: site.mapsLink, isExternal: true },
    { icon: MessageCircle, title: 'WhatsApp Resmi', value: site.contact.whatsappDisplay, href: `https://wa.me/${site.contact.whatsapp}`, isExternal: true },
    { icon: Mail, title: 'Email Informasi', value: site.contact.email, href: `mailto:${site.contact.email}`, isExternal: false },
    { icon: Clock, title: 'Jam Layanan Kantor', value: site.hours, href: undefined, isExternal: false },
  ]

  const inputCls = (key: string) =>
    `w-full rounded-2xl border-2 bg-cream/70 px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary ${
      errors[key] ? 'border-warmred' : 'border-primary/10'
    }`

  return (
    <>
      <PageHeader
        eyebrow="Layanan Informasi &amp; Kontak"
        title="Kami Siap Melayani &amp; Menyambut Anda"
        description="Punya pertanyaan seputar pendaftaran santri baru (PPDB), kurikulum 5 sentra, atau ingin menjadwalkan kunjungan sekolah (*school tour*)? Silakan hubungi kami."
        crumbs={[{ label: 'Kontak' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="sr-only">Kontak dan Lokasi</h2>
          
          {/* Kartu Kontak */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((c, i) => {
              const inner = (
                <>
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-softgreen text-primary transition-transform duration-300 group-hover:scale-110">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-ink-mute">{c.title}</h3>
                  <p className="mt-1 text-sm font-extrabold leading-snug text-primary">{c.value}</p>
                </>
              )
              return (
                <Reveal key={c.title} delay={i * 80} className="h-full">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.isExternal ? '_blank' : undefined}
                      rel={c.isExternal ? 'noreferrer' : undefined}
                      className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift">
                      {inner}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>

          {/* Form + Maps */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-primary/10 bg-white p-10 text-center shadow-soft">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-softgreen text-primary">
                    <Check className="h-8 w-8 text-primary" strokeWidth={3} />
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-primary">Pesan Terkirim!</h3>
                  <p className="max-w-sm text-sm text-ink-soft">
                    Terima kasih, {form.name}. Tim sekretariat kami akan membalas pesan Anda secepatnya melalui WhatsApp {form.whatsapp || 'yang Anda cantumkan'}.
                  </p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', whatsapp: '', message: '' }) }}>
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-3xl border border-primary/10 bg-white p-8 shadow-soft" noValidate>
                  <h3 className="font-heading text-xl font-extrabold text-primary">Kirim Pesan ke Sekretariat</h3>
                  <p className="mt-1 text-xs text-ink-mute">Kami akan merespons pertanyaan Anda via WhatsApp atau email resmi.</p>
                  
                  <div className="mt-6 grid gap-4">
                    <div>
                      <label htmlFor="k-nama" className="mb-1.5 block text-xs font-extrabold text-ink">Nama Lengkap</label>
                      <input id="k-nama" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda / Calon Wali Murid" className={inputCls('name')} />
                      {errors.name && <p className="mt-1.5 text-xs font-semibold text-warmred">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="k-wa" className="mb-1.5 block text-xs font-extrabold text-ink">Nomor WhatsApp Aktif</label>
                      <input id="k-wa" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="08xxxxxxxxxx" className={inputCls('whatsapp')} />
                    </div>
                    <div>
                      <label htmlFor="k-pesan" className="mb-1.5 block text-xs font-extrabold text-ink">Isi Pesan / Pertanyaan</label>
                      <textarea id="k-pesan" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tuliskan pertanyaan seputar pendaftaran, program sekolah, atau jadwal kunjungan..." className={`${inputCls('message')} resize-none`} />
                      {errors.message && <p className="mt-1.5 text-xs font-semibold text-warmred">{errors.message}</p>}
                    </div>
                    <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto shadow-soft">
                      <Send className="h-4 w-4" /> Kirim Pesan Sekarang
                    </Button>
                  </div>
                </form>
              )}
            </Reveal>

            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-soft h-full min-h-[380px]">
                <iframe
                  title={`Peta lokasi ${site.name}`}
                  src={site.mapsEmbed}
                  className="h-full min-h-[380px] w-full grayscale-[15%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Cepat */}
      <section className="px-4 pb-20 sm:px-6">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 rounded-3xl bg-primary p-8 text-white shadow-lift sm:flex-row sm:p-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold shadow-soft">
              <Phone className="h-7 w-7" />
            </span>
            <div>
              <h3 className="font-heading text-xl font-extrabold sm:text-2xl">Konsultasi Cepat via WhatsApp?</h3>
              <p className="text-xs sm:text-sm text-white/80">Layanan konsultasi orang tua: {site.hours}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin konsultasi pendaftaran TK Islam Al-Mustam.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-extrabold text-primary-deep shadow-gold transition-all hover:-translate-y-0.5 hover:bg-gold-light"
          >
            <MessageCircle className="h-5 w-5" /> Chat Admin Sekarang
          </a>
        </Reveal>
      </section>
    </>
  )
}
