import { ShieldCheck, Wallet, Headset, RefreshCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DonationForm from '../components/forms/DonationForm'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'

const trust = [
  { icon: ShieldCheck, title: 'Amanah & Transparan', desc: 'Dana dikelola bendahara yayasan dan dilaporkan berkala ke publik.' },
  { icon: Wallet, title: 'Tersalurkan Langsung', desc: 'Penyaluran langsung ke program dan penerima manfaat yang terdata.' },
  { icon: Headset, title: 'Didampingi Tim', desc: 'Tim kami siap membantu konfirmasi donasi melalui WhatsApp.' },
  { icon: RefreshCcw, title: 'Zakat, Infaq, Sedekah', desc: 'Menerima zakat, infaq, sedekah, dan wakaf dengan ketentuan masing-masing.' },
]

export default function Donasi() {
  useSEO({
    title: 'Donasi',
    description: 'Donasi online untuk program pendidikan yatim, beasiswa, makanan anak, dan fasilitas sekolah di Yayasan Mustam.',
    path: '/yatim/donasi',
  })

  return (
    <>
      <PageHeader
        eyebrow="Donasi"
        title="Donasi Anda, Amanah Kami"
        description="Salurkan kebaikan Anda melalui program yang jelas dan terukur. Setiap rupiah tercatat dan dilaporkan."
        crumbs={[{ label: 'Program Yatim', href: '/yatim' }, { label: 'Donasi' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* form */}
            <Reveal>
              <DonationForm />
            </Reveal>

            {/* info keamanan */}
            <div className="flex flex-col gap-4">
              {trust.map((t, i) => (
                <Reveal key={t.title} delay={i * 70}>
                  <div className="flex items-start gap-4 rounded-card bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-softgreen text-primary">
                      <t.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-primary">{t.title}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{t.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={300}>
                <div className="rounded-card bg-primary p-6 text-white">
                  <h3 className="font-heading text-base font-extrabold">Transfer Manual</h3>
                  <p className="mt-1 text-xs text-white/70">Konfirmasi setelah transfer ke WhatsApp kami.</p>
                  <div className="mt-4 rounded-xl bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/60">BSI — a.n. Yayasan Mustam</p>
                    <p className="font-heading text-xl font-extrabold tabular-nums text-gold">1234 5678 90</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
