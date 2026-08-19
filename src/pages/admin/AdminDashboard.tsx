import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  FileText,
  GalleryHorizontalEnd,
  HandCoins,
  Heart,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
  Building,
  Database,
  Lock,
} from 'lucide-react'
import { LogoEmblem } from '../../components/Logo'
import { useSEO } from '../../hooks/useSEO'
import { useCMS } from '../../hooks/useCMS'
import { formatRupiah } from '../../lib/format'

// CMS Tabs
import AdminLoginModal from './components/AdminLoginModal'
import SiteSettingsTab from './components/SiteSettingsTab'
import NewsManagementTab from './components/NewsManagementTab'
import ProgramsManagementTab from './components/ProgramsManagementTab'
import TeachersManagementTab from './components/TeachersManagementTab'
import GalleryManagementTab from './components/GalleryManagementTab'
import PPDBManagementTab from './components/PPDBManagementTab'
import DonasiManagementTab from './components/DonasiManagementTab'
import FacilitiesManagementTab from './components/FacilitiesManagementTab'
import DataBackupTab from './components/DataBackupTab'

type PanelId =
  | 'dashboard'
  | 'ppdb'
  | 'program'
  | 'guru'
  | 'berita'
  | 'galeri'
  | 'donasi'
  | 'fasilitas'
  | 'pengaturan'
  | 'backup'

/* ===== Chart komponen (SVG murni, ringan) ===== */
function BarChart({ data, color = '#124B3A' }: { data: { month: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="mt-4 flex h-44 items-end gap-2" role="img" aria-label="Grafik batang">
      {data.map((d) => (
        <div key={d.month} className="group relative flex flex-1 flex-col items-center gap-2">
          <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {d.value}
          </span>
          <div
            className="w-full max-w-9 rounded-t-lg transition-all duration-500 group-hover:opacity-80"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color }}
          />
          <span className="text-[10px] font-semibold text-ink-mute">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0
  const R = 42
  const C = 2 * Math.PI * R
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0" role="img" aria-label="Donat program aktif">
        <circle cx="60" cy="60" r={R} fill="none" stroke="#F6ECD9" strokeWidth="16" />
        {data.map((d) => {
          const frac = d.value / total
          const dash = frac * C
          const el = (
            <circle
              key={d.label}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          )
          offset += dash
          return el
        })}
        <text
          x="60"
          y="58"
          textAnchor="middle"
          className="fill-primary"
          fontSize="20"
          fontWeight="800"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {total}%
        </text>
        <text x="60" y="74" textAnchor="middle" className="fill-[#7B8B84]" fontSize="9" fontWeight="600">
          program
        </text>
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label} <span className="ml-auto font-extrabold text-primary">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Diterima: 'bg-softgreen text-primary',
    Wawancara: 'bg-softyellow text-gold-ink',
    Verifikasi: 'bg-softblue text-secondary-dark',
    Baru: 'bg-softred text-warmred-dark',
    Terkumpul: 'bg-softblue text-secondary-dark',
    Tersalur: 'bg-softgreen text-primary',
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[status] ?? 'bg-cream text-ink-soft'}`}>
      {status}
    </span>
  )
}

/* ===== Panel Utama Dashboard ===== */
function DashboardOverview({ onNavigate }: { onNavigate: (panel: PanelId) => void }) {
  const { data } = useCMS()

  const totalDonation = data.donations.reduce((sum, d) => sum + d.amount, 0)
  const newApplicants = data.ppdbApplicants.filter((a) => a.status === 'Baru').length

  const chartPendaftaran = [
    { month: 'Mar', value: 6 },
    { month: 'Apr', value: 9 },
    { month: 'Mei', value: 12 },
    { month: 'Jun', value: 10 },
    { month: 'Jul', value: 18 },
    { month: 'Agu', value: data.ppdbApplicants.length },
  ]

  const chartDonasi = [
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 44 },
    { month: 'Mei', value: 52 },
    { month: 'Jun', value: 48 },
    { month: 'Jul', value: 55 },
    { month: 'Agu', value: 61 },
  ]

  const programAktif = [
    { label: 'Pendidikan Yatim', value: 41, color: '#124B3A' },
    { label: 'Beasiswa', value: 18, color: '#3D82C6' },
    { label: 'Makanan Anak', value: 22, color: '#F4C542' },
    { label: 'Fasilitas', value: 12, color: '#C94C4C' },
    { label: 'Operasional', value: 7, color: '#8AA79B' },
  ]

  return (
    <div className="space-y-6">
      {/* 4 STATS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          onClick={() => onNavigate('ppdb')}
          className="group cursor-pointer rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softgreen text-primary group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-softgreen px-2.5 py-1 text-xs font-bold text-primary">
              <ArrowUpRight className="h-3 w-3" /> {newApplicants} Baru
            </span>
          </div>
          <p className="mt-4 font-heading text-2xl font-black text-primary">{data.ppdbApplicants.length}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Calon Siswa PPDB</p>
        </div>

        <div
          onClick={() => onNavigate('berita')}
          className="group cursor-pointer rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softblue text-secondary-dark group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-softblue px-2.5 py-1 text-xs font-bold text-secondary-dark">
              {data.news.filter((n) => n.featured).length} Utama
            </span>
          </div>
          <p className="mt-4 font-heading text-2xl font-black text-primary">{data.news.length}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Artikel Berita</p>
        </div>

        <div
          onClick={() => onNavigate('donasi')}
          className="group cursor-pointer rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softred/30 text-warmred group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-softred/40 px-2.5 py-1 text-xs font-bold text-warmred-dark">
              {data.orphans.filter((o) => o.status === 'Aktif Terbantu').length} Terbantu
            </span>
          </div>
          <p className="mt-4 font-heading text-2xl font-black text-primary">{data.orphans.length}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Santri Yatim Binaan</p>
        </div>

        <div
          onClick={() => onNavigate('donasi')}
          className="group cursor-pointer rounded-3xl border border-primary/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-softyellow text-gold-ink group-hover:scale-110 transition-transform">
              <HandCoins className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-softyellow px-2.5 py-1 text-xs font-bold text-gold-ink">
              {data.donations.length} Trx
            </span>
          </div>
          <p className="mt-4 font-heading text-xl font-black text-primary truncate">{formatRupiah(totalDonation)}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Total Donasi Masuk</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <h3 className="font-heading text-base font-extrabold text-primary">Pendaftaran Siswa PPDB (6 Bulan)</h3>
          <BarChart data={chartPendaftaran} />
        </div>
        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <h3 className="font-heading text-base font-extrabold text-primary">Donasi Masuk per Bulan (Juta Rupiah)</h3>
          <BarChart data={chartDonasi} color="#F4C542" />
        </div>
      </div>

      {/* QUICK PREVIEW & RECENT APPLICANTS */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <h3 className="mb-5 font-heading text-base font-extrabold text-primary">Distribusi Program Aktif</h3>
          <DonutChart data={programAktif} />
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-extrabold text-primary">Pendaftar PPDB Terbaru</h3>
            <button
              type="button"
              onClick={() => onNavigate('ppdb')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Lihat Semua →
            </button>
          </div>
          <ul className="mt-4 divide-y divide-primary/5">
            {data.ppdbApplicants.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold text-ink">{p.name}</p>
                  <p className="text-xs text-ink-mute">
                    {p.id} • {p.program}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  useSEO({ title: 'CMS Admin Dashboard', path: '/admin' })
  const { data, isLoggedIn, logout } = useCMS()

  const [panel, setPanel] = useState<PanelId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const sidebarBtnRef = useRef<HTMLButtonElement | null>(null)

  const menu: { id: PanelId; label: string; icon: any; badge?: string }[] = useMemo(
    () => [
      { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
      {
        id: 'ppdb',
        label: 'PPDB & Calon Siswa',
        icon: FileText,
        badge: String(data.ppdbApplicants.length),
      },
      { id: 'program', label: 'Program & Biaya', icon: BookOpen },
      { id: 'guru', label: 'Guru & Tenaga Pendidik', icon: Users, badge: String(data.teachers.length) },
      { id: 'berita', label: 'Berita & Kegiatan', icon: Sparkles, badge: String(data.news.length) },
      { id: 'galeri', label: 'Galeri Foto', icon: GalleryHorizontalEnd, badge: String(data.gallery.length) },
      { id: 'donasi', label: 'Santri Yatim & Donasi', icon: Heart },
      { id: 'fasilitas', label: 'Fasilitas Kampus', icon: Building },
      { id: 'pengaturan', label: 'Identitas & Kontak', icon: Settings },
      { id: 'backup', label: 'Backup & Restore Data', icon: Database },
    ],
    [data]
  )

  // Auto-logout whenever leaving / navigating away from the admin route
  useEffect(() => {
    return () => {
      logout()
    }
  }, [logout])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        sidebarBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  const activeLabel = useMemo(() => menu.find((m) => m.id === panel)?.label ?? 'Ringkasan', [menu, panel])

  // If not logged in, render authentication modal
  if (!isLoggedIn) {
    return <AdminLoginModal />
  }

  const panelContent = (() => {
    switch (panel) {
      case 'dashboard':
        return <DashboardOverview onNavigate={(p) => setPanel(p)} />
      case 'ppdb':
        return <PPDBManagementTab />
      case 'program':
        return <ProgramsManagementTab />
      case 'guru':
        return <TeachersManagementTab />
      case 'berita':
        return <NewsManagementTab />
      case 'galeri':
        return <GalleryManagementTab />
      case 'donasi':
        return <DonasiManagementTab />
      case 'fasilitas':
        return <FacilitiesManagementTab />
      case 'pengaturan':
        return <SiteSettingsTab />
      case 'backup':
        return <DataBackupTab />
      default:
        return <DashboardOverview onNavigate={(p) => setPanel(p)} />
    }
  })()

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <LogoEmblem size={40} />
        <div>
          <p className="font-heading text-base font-extrabold text-white">CMS Al-Mustam</p>
          <p className="text-xs text-white/50">Admin Panel Kendali</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Menu admin">
        {menu.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setPanel(m.id)
              setSidebarOpen(false)
            }}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
              panel === m.id
                ? 'bg-gold text-primary shadow-soft'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            aria-current={panel === m.id ? 'page' : undefined}
          >
            <m.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{m.label}</span>
            {m.badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  panel === m.id ? 'bg-primary text-white' : 'bg-white/15 text-white'
                }`}
              >
                {m.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold text-white shadow-soft transition-all hover:bg-warmred hover:text-white"
        >
          <Lock className="h-4 w-4 text-gold-light" />
          <span>Kunci / Logout Admin</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-cream">
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-primary-deep lg:block">{sidebar}</aside>

      {/* sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
          <div className="absolute inset-0 bg-primary-deep/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside id="menu-admin-mobile" className="absolute left-0 top-0 h-full w-72 bg-primary-deep shadow-lift">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false)
                sidebarBtnRef.current?.focus()
              }}
              className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white"
              aria-label="Tutup menu admin"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-primary/10 bg-white/85 px-4 py-3.5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              ref={sidebarBtnRef}
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 text-primary lg:hidden"
              aria-label="Buka menu admin"
              aria-expanded={sidebarOpen}
              aria-controls="menu-admin-mobile"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[11px] font-bold text-ink-mute">Admin CMS / {activeLabel}</p>
              <h1 className="font-heading text-lg font-extrabold text-primary">{activeLabel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 text-primary transition-colors hover:bg-softgreen"
                aria-label="Notifikasi"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warmred" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-3xl border border-primary/10 bg-white p-4 shadow-lift">
                  <p className="px-1 pb-2 text-xs font-bold uppercase tracking-wider text-ink-mute">Notifikasi Sistem</p>
                  <p className="rounded-2xl bg-softgreen px-3.5 py-3 text-xs font-semibold text-primary">
                    {data.ppdbApplicants.filter((a) => a.status === 'Baru').length} pendaftar baru PPDB siap diverifikasi.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-heading text-sm font-extrabold text-gold shadow-soft">
                AY
              </span>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-ink">Admin Yayasan</p>
                <p className="text-[11px] text-ink-mute">{data.site.contact.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-mute">
              Panel Pengelolaan Konten Terpusat (CMS) — Yayasan Pendidikan Islam Al-Mustam
            </p>
            <span className="rounded-full bg-softyellow px-4 py-1.5 text-xs font-bold text-gold-ink shadow-soft">
              {new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date())}
            </span>
          </div>
          {panelContent}
        </main>
      </div>
    </div>
  )
}
