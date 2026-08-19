import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { LogoEmblem } from '../components/Logo'

export default function NotFound() {
  useSEO({ title: 'Halaman Tidak Ditemukan', path: '/404' })

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-none bg-softyellow blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-none bg-softgreen blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-8 opacity-10">
        <LogoEmblem size={160} />
      </div>

      <div className="relative">
        <p className="font-heading text-7xl font-extrabold text-primary sm:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl font-extrabold text-primary sm:text-3xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-light hover:shadow-lift"
        >
          <Home className="h-4.5 w-4.5" /> Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
