import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  X,
} from 'lucide-react'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons'
import { navItems, type NavItem } from '../data/site'
import { useCMS } from '../hooks/useCMS'

export default function Navbar() {
  const { data } = useCMS()
  const site = data.site

  const socials = [
    { icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
    { icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
    { icon: YoutubeIcon, href: site.social.youtube, label: 'YouTube' },
  ]
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null)
  const location = useLocation()
  const dropdownTimer = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Tutup menu saat pindah rute
  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
    setSearchOpen(false)
  }, [location.pathname])

  // Cegah scroll saat mobile drawer terbuka
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const openSearch = () => {
    setMobileOpen(false)
    setSearchOpen(true)
  }

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimer.current) window.clearTimeout(dropdownTimer.current)
    setActiveDropdown(label)
  }

  const handleDropdownLeave = () => {
    if (dropdownTimer.current) window.clearTimeout(dropdownTimer.current)
    dropdownTimer.current = window.setTimeout(() => setActiveDropdown(null), 180)
  }

  const isItemActive = (item: NavItem) => {
    if (location.pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => location.pathname === child.href)
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      
      {/* ===== 1. TOP UTILITY STRIP (DESKTOP) ===== */}
      <div
        className={`hidden border-b border-white/10 bg-primary-deep text-white transition-all duration-300 lg:block ${
          scrolled ? 'invisible max-h-0 opacity-0 overflow-hidden' : 'visible max-h-11 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2 text-xs">
          
          {/* Sisi Kiri: Akreditasi & Lokasi */}
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-semibold text-gold-light">
              <Award className="h-3.5 w-3.5 text-gold" />
              <span>{site.accreditation} (NPSN: {site.npsn})</span>
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-white/80">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>{site.hours}</span>
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-white/75">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="max-w-[260px] truncate">{site.contact.addressShort}</span>
            </span>
          </div>

          {/* Sisi Kanan: Status PPDB & Sosial */}
          <div className="flex items-center gap-4">
            <Link
              to="/ppdb"
              className="flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-0.5 text-[11px] font-black text-primary-deep shadow-soft transition-all hover:bg-gold-light"
            >
              <CalendarDays className="h-3 w-3" />
              <span>PPDB 2026/2027 Dibuka</span>
            </Link>
            
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-gold hover:text-primary-deep"
                >
                  <s.icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===== 2. MAIN NAVIGATION BAR ===== */}
      <div
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? 'border-primary/15 bg-white/95 shadow-lift backdrop-blur-xl py-3'
            : 'border-primary/10 bg-white/90 shadow-soft backdrop-blur-md py-3.5'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6">
          
          {/* LOGO */}
          <Logo />

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const active = isItemActive(item)
              const hasDropdown = Boolean(item.children && item.children.length > 0)

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={() =>
                      `flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] xl:text-sm font-bold transition-all ${
                        active
                          ? 'bg-primary text-white shadow-soft'
                          : 'text-ink-soft hover:bg-softgreen/80 hover:text-primary'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        } ${active ? 'text-white' : 'text-ink-mute'}`}
                      />
                    )}
                  </NavLink>

                  {/* FLYOUT DROPDOWN MENU */}
                  {hasDropdown && activeDropdown === item.label && (
                    <div
                      className={`absolute top-full pt-3 z-50 ${
                        item.children && item.children.length > 4 ? 'left-1/2 -translate-x-1/2 w-[520px]' : 'left-0 w-[340px]'
                      }`}
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                    >
                      <div className="dropdown-in overflow-hidden rounded-3xl border border-primary/15 bg-white p-4 shadow-lift ring-1 ring-black/5">
                        
                        {/* Header Mini Dropdown */}
                        <div className="mb-2 flex items-center justify-between border-b border-primary/10 pb-2.5 px-2">
                          <span className="text-xs font-black uppercase tracking-wider text-primary">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-semibold text-ink-mute">
                            {item.children?.length} Menu
                          </span>
                        </div>

                        {/* Grid Link Items */}
                        <div className={`grid gap-1.5 ${item.children && item.children.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="group flex flex-col justify-center rounded-2xl p-2.5 transition-all hover:bg-softgreen/70"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs sm:text-sm font-extrabold text-primary transition-colors group-hover:text-primary-light">
                                  {child.label}
                                </span>
                                {child.badge && (
                                  <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[10px] font-black text-primary-deep">
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {child.desc && (
                                <p className="mt-0.5 text-[11px] leading-tight text-ink-mute group-hover:text-ink-soft">
                                  {child.desc}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* DESKTOP RIGHT ACTIONS */}
          <div className="hidden items-center gap-2.5 lg:flex">
            
            {/* Search Button */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Cari di website"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white text-ink-soft shadow-soft transition-all hover:border-gold hover:bg-softyellow hover:text-primary"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin bertanya seputar TK Islam Al-Mustam.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-softgreen px-4 py-2 text-xs font-extrabold text-primary transition-all hover:bg-softgreen/80"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>WhatsApp</span>
            </a>

            {/* PPDB Action Button */}
            <Link
              to="/ppdb/daftar"
              className="group flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs sm:text-sm font-black text-primary-deep shadow-soft transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-gold"
            >
              <span>Daftar PPDB</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* MOBILE TOGGLES (SEARCH & HAMBURGER) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Cari di website"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-white text-primary shadow-soft"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors shadow-soft ${
                mobileOpen ? 'border-primary/20 bg-primary text-white' : 'border-primary/10 bg-white text-primary'
              }`}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ===== 3. SEARCH OVERLAY ===== */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ===== 4. MOBILE DRAWER OVERLAY ===== */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-75px)] overflow-y-auto bg-white/98 px-4 pb-12 pt-2 shadow-2xl backdrop-blur-2xl lg:hidden border-b border-primary/15">
          <div className="mx-auto max-w-lg">
            
            {/* Accreditation Seal Mini Banner */}
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-softgreen p-3 border border-primary/10">
              <span className="flex items-center gap-2 text-xs font-extrabold text-primary">
                <Award className="h-4 w-4 text-gold-dark" />
                <span>{site.accreditation} (NPSN: {site.npsn})</span>
              </span>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white">
                Terverifikasi
              </span>
            </div>

            {/* Mobile Nav Accordion */}
            <nav className="space-y-1" aria-label="Navigasi Mobile">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0)
                const isAccordionOpen = mobileAccordion === item.label
                const active = isItemActive(item)

                if (!hasChildren) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      end={item.href === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors ${
                          isActive ? 'bg-primary text-white' : 'text-ink hover:bg-softgreen'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </NavLink>
                  )
                }

                return (
                  <div key={item.label} className="rounded-2xl border border-primary/5 bg-cream/40 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : item.label)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-extrabold text-primary transition-colors hover:bg-softgreen"
                      aria-expanded={isAccordionOpen}
                    >
                      <span className={active ? 'text-primary font-black' : 'text-ink'}>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-primary transition-transform duration-200 ${
                          isAccordionOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isAccordionOpen && (
                      <div className="space-y-1 border-t border-primary/10 bg-white p-2">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="flex flex-col rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink-soft hover:bg-softgreen hover:text-primary transition-colors"
                          >
                            <span className="flex items-center justify-between">
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="rounded-full bg-softyellow px-2 py-0.5 text-[9px] font-black text-gold-ink">
                                  {child.badge}
                                </span>
                              )}
                            </span>
                            {child.desc && (
                              <span className="text-[10px] text-ink-mute font-normal mt-0.5">{child.desc}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Mobile Bottom Quick Actions */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-primary/10 pt-4">
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum Admin, saya ingin bertanya seputar pendaftaran TK Islam Al-Mustam.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-softgreen px-4 py-3.5 text-xs font-extrabold text-primary shadow-soft"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Chat Admin</span>
              </a>

              <Link
                to="/ppdb/daftar"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3.5 text-xs font-black text-primary-deep shadow-gold"
              >
                <span>Daftar PPDB</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* School Contact Quick Info */}
            <div className="mt-4 rounded-2xl bg-cream/70 p-3.5 text-center text-xs text-ink-mute">
              <p className="font-semibold text-primary">{site.name}</p>
              <p className="mt-0.5">{site.contact.addressShort}</p>
            </div>

          </div>
        </div>
      )}

    </header>
  )
}
