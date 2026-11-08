import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { useCMS } from '../hooks/useCMS'
import { FaWhatsapp } from 'react-icons/fa6'
import { RiInformationLine, RiArrowRightLine } from 'react-icons/ri'

/** Sticky Quick Action Bar untuk Mobile — mempermudah orang tua mendaftar & chat WA. */
export default function MobileCTA() {
  const { data } = useCMS()
  const ppdbOpen = Boolean(
    data.pageContent.ppdb.registrationOpen &&
      (data.pageContent.ppdb.waves?.some((w) => w.status === 'OPEN') ?? true)
  )

  return (
    <nav aria-label="Aksi cepat orang tua" className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-lift backdrop-blur-xl">
        <a
          href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin bertanya seputar pendaftaran TK Islam Al-Mustam.')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-softgreen px-3.5 py-2.5 text-xs font-extrabold text-primary transition-transform active:scale-95"
          aria-label="Chat WhatsApp Admin"
        >
          <FaWhatsapp className="h-4 w-4 text-primary" />
          <span>Chat WA</span>
        </a>

        <Link
          to="/ppdb"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/10 bg-cream px-3 py-2.5 text-xs font-bold text-primary transition-colors active:scale-95"
        >
          <RiInformationLine className="h-4 w-4 text-gold-dark" />
          <span>Info Biaya</span>
        </Link>

        {ppdbOpen ? (
          <Link
            to="/ppdb/daftar"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-soft transition-all active:scale-95"
          >
            <span>Daftar PPDB</span>
            <RiArrowRightLine className="h-3.5 w-3.5 text-gold" />
          </Link>
        ) : (
          <Link
            to="/ppdb"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cream border border-primary/20 px-3 py-2.5 text-center text-xs font-bold text-ink-soft transition-all active:scale-95"
          >
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>PPDB Ditutup</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
