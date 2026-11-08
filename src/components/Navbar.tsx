import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'
import { navItems, type NavItem } from '../data/site'
import { useCMS } from '../hooks/useCMS'
import { getPageIcon } from './icons/pageIconUtils'
import {
  RiSearchLine,
  RiMenu3Line,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiAwardLine,
} from './icons/PageIcons'

export default function Navbar() {
  const { data } = useCMS()
  const site = data.site

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
      {/* MAIN NAVIGATION BAR */}
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
              const ItemIcon = getPageIcon(item.label)

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
                      `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] xl:text-sm font-bold transition-all ${
                        active
                          ? 'bg-primary text-white shadow-soft'
                          : 'text-ink-soft hover:bg-softgreen/80 hover:text-primary'
                      }`
                    }
                  >
                    <ItemIcon className={`h-4 w-4 ${active ? 'text-gold-light' : 'text-primary/70'}`} />
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <RiArrowDownSLine
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        } ${active ? 'text-white' : 'text-ink-mute'}`}
                      />
                    )}
                  </NavLink>

                  {/* FLYOUT DROPDOWN MENU */}
                  {hasDropdown && activeDropdown === item.label && (
                    <div
                      className={`absolute top-full pt-3 z-50 ${
                        item.children && item.children.length > 4 ? 'left-1/2 -translate-x-1/2 w-[540px]' : 'left-0 w-[350px]'
                      }`}
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                    >
                      <div className="dropdown-in overflow-hidden rounded-3xl border border-primary/15 bg-white p-4 shadow-lift ring-1 ring-black/5">
                        
                        {/* Header Mini Dropdown */}
                        <div className="mb-2 flex items-center justify-between border-b border-primary/10 pb-2.5 px-2">
                          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
                            <ItemIcon className="h-4 w-4 text-gold-dark" />
                            <span>{item.label}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-ink-mute">
                            {item.children?.length} Menu
                          </span>
                        </div>

                        {/* Grid Link Items dengan react-icons sesuai judul */}
                        <div className={`grid gap-1.5 ${item.children && item.children.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {item.children?.map((child) => {
                            const ChildIcon = getPageIcon(child.label)
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => {
                                  setActiveDropdown(null)
                                  if (child.href.includes('#')) {
                                    const hashId = child.href.split('#')[1]
                                    const el = document.getElementById(hashId)
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }
                                  }
                                }}
                                className="group flex items-start gap-3 rounded-2xl p-2.5 transition-all hover:bg-softgreen/70"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-softgreen text-primary transition-colors group-hover:bg-primary group-hover:text-gold shadow-2xs mt-0.5">
                                  <ChildIcon className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs sm:text-sm font-extrabold text-primary transition-colors group-hover:text-primary-light">
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[10px] font-black text-primary-deep shrink-0">
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  {child.desc && (
                                    <p className="mt-0.5 text-[11px] leading-tight text-ink-mute group-hover:text-ink-soft line-clamp-1">
                                      {child.desc}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            )
                          })}
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
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-white text-ink-soft transition-colors hover:border-gold hover:bg-softyellow hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RiSearchLine className="h-5 w-5" />
            </button>

            {/* PPDB Action Button */}
            {data.pageContent.ppdb.registrationOpen && (data.pageContent.ppdb.waves?.some((w) => w.status === 'OPEN') ?? true) ? (
              <a
                href="/ppdb/daftar"
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-10 items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-primary-deep transition-all hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm shadow-xs"
              >
                <span>Daftar PPDB</span>
                <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : (
              <Link
                to="/ppdb"
                className="group flex min-h-10 items-center gap-1.5 rounded-lg bg-cream border border-primary/20 px-3.5 py-2 text-xs font-bold text-ink-soft transition-all hover:bg-softyellow sm:text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>PPDB Ditutup</span>
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLES (SEARCH & HAMBURGER) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Cari di website"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-white text-primary shadow-soft"
            >
              <RiSearchLine className="h-5 w-5" />
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
              {mobileOpen ? <RiCloseLine className="h-6 w-6" /> : <RiMenu3Line className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH OVERLAY */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-75px)] overflow-y-auto bg-white/98 px-4 pb-12 pt-2 shadow-2xl backdrop-blur-2xl lg:hidden border-b border-primary/15">
          <div className="mx-auto max-w-lg">
            
            {/* Accreditation Seal Mini Banner */}
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-softgreen p-3 border border-primary/10">
              <span className="flex items-center gap-2 text-xs font-extrabold text-primary">
                <RiAwardLine className="h-4.5 w-4.5 text-gold-dark" />
                <span>{site.accreditation} (NPSN: {site.npsn})</span>
              </span>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white">
                Terverifikasi
              </span>
            </div>

            {/* Mobile Nav Accordion */}
            <nav className="space-y-1.5" aria-label="Navigasi Mobile">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0)
                const isAccordionOpen = mobileAccordion === item.label
                const active = isItemActive(item)
                const ItemIcon = getPageIcon(item.label)

                if (!hasChildren) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      end={item.href === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={() =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                          active
                            ? 'bg-primary text-white shadow-soft'
                            : 'text-ink-soft hover:bg-softgreen hover:text-primary'
                        }`
                      }
                    >
                      <ItemIcon className={`h-5 w-5 ${active ? 'text-gold-light' : 'text-primary'}`} />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                }

                return (
                  <div key={item.label} className="overflow-hidden rounded-2xl border border-primary/10 bg-cream/40">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : item.label)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-extrabold text-primary"
                    >
                      <span className="flex items-center gap-2.5">
                        <ItemIcon className="h-5 w-5 text-gold-dark" />
                        <span>{item.label}</span>
                      </span>
                      <RiArrowDownSLine
                        className={`h-5 w-5 text-ink-mute transition-transform duration-200 ${
                          isAccordionOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>

                    {isAccordionOpen && (
                      <div className="space-y-1 border-t border-primary/10 bg-white p-2">
                        <NavLink
                          to={item.href}
                          end
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-softgreen"
                        >
                          <span className="flex items-center gap-2">
                            <ItemIcon className="h-4 w-4 text-primary" />
                            <span>Ikhtisar {item.label}</span>
                          </span>
                          <RiArrowRightLine className="h-3.5 w-3.5" />
                        </NavLink>
                        {item.children?.map((child) => {
                          const ChildIcon = getPageIcon(child.label)
                          return (
                            <NavLink
                              key={child.href}
                              to={child.href}
                              onClick={() => {
                                setMobileOpen(false)
                                if (child.href.includes('#')) {
                                  const hashId = child.href.split('#')[1]
                                  const el = document.getElementById(hashId)
                                  if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                  }
                                }
                              }}
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-softgreen hover:text-primary"
                            >
                              <span className="flex items-center gap-2">
                                <ChildIcon className="h-3.5 w-3.5 text-primary/70" />
                                <span>{child.label}</span>
                              </span>
                              {child.badge && (
                                <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[9px] font-black text-primary-deep">
                                  {child.badge}
                                </span>
                              )}
                            </NavLink>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Mobile Bottom Quick Actions */}
            <div className="mt-5 border-t border-primary/10 pt-4">
              {data.pageContent.ppdb.registrationOpen && (data.pageContent.ppdb.waves?.some((w) => w.status === 'OPEN') ?? true) ? (
                <a
                  href="/ppdb/daftar"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gold px-4 py-3 text-xs font-bold text-primary-deep shadow-gold w-full"
                >
                  <span>Daftar PPDB Online</span>
                  <RiArrowRightLine className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  to="/ppdb"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cream border border-primary/20 px-4 py-3 text-xs font-bold text-ink-soft w-full"
                >
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span>Informasi PPDB (Pendaftaran Ditutup)</span>
                </Link>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between px-1 text-xs">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-bold text-primary hover:underline"
              >
                Portal Admin CMS &rarr;
              </Link>
              <a
                href="/admin"
                className="font-semibold text-ink-mute hover:text-primary"
              >
                Sistem Sekolah &rarr;
              </a>
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
