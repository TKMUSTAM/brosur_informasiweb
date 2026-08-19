import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileCTA from './MobileCTA'
import ChatWidget from './chat/ChatWidget'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {/* Skip link — akses keyboard langsung ke konten utama */}
      <a
        href="#konten-utama"
        className="sr-only z-[80] rounded-full bg-primary px-5 py-2.5 font-bold text-white shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama" className="flex-1 scroll-mt-24 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileCTA />
      <ChatWidget />
    </div>
  )
}
