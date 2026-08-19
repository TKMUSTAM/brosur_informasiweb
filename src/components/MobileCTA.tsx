import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, UserPlus, Info } from 'lucide-react'
import { site } from '../data/site'

/** Sticky Quick Action Bar untuk Mobile — mempermudah orang tua mendaftar & chat WA. */
export default function MobileCTA() {
  return (
    <nav aria-label="Aksi cepat orang tua" className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-lift backdrop-blur-xl">
        <a
          href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin bertanya seputar pendaftaran TK Islam Al-Mustam.')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl bg-softgreen px-4 py-2.5 text-xs font-extrabold text-primary transition-transform active:scale-95"
          aria-label="Chat WhatsApp Admin"
        >
          <MessageCircle className="h-4.5 w-4.5 text-primary" />
          <span>Chat WA</span>
        </a>

        <Link
          to="/ppdb"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/10 bg-cream px-3 py-2.5 text-xs font-bold text-primary transition-colors active:scale-95"
        >
          <Info className="h-4 w-4 text-gold-dark" />
          <span>Info Biaya</span>
        </Link>

        <Link
          to="/ppdb/daftar"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-soft transition-all active:scale-95"
        >
          <UserPlus className="h-4 w-4 text-gold" />
          <span>Daftar Online</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </nav>
  )
}
