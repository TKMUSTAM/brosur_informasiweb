import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, Bell, BookOpen, CalendarDays, ChartColumn, FileText, GalleryHorizontalEnd,
  GraduationCap, HandCoins, Heart, LayoutDashboard, LogOut, Menu, Moon, Settings,
  Sparkles, Users, X,
} from 'lucide-react'
import Icon from '../../components/Icon'
import { LogoEmblem } from '../../components/Logo'
import { useSEO } from '../../hooks/useSEO'
import { adminChart, adminDonations, adminPpdb, adminStats } from '../../data/donations'
import { formatRupiah } from '../../lib/format'

type PanelId =
  | 'dashboard' | 'ppdb' | 'siswa' | 'guru' | 'program' | 'yatim' | 'donasi'
  | 'laporan' | 'berita' | 'galeri' | 'konten' | 'jadwal' | 'pengaturan'

const menu: { id: PanelId; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ppdb', label: 'PPDB', icon: FileText, badge: '24' },
  { id: 'siswa', label: 'Siswa', icon: GraduationCap },
  { id: 'guru', label: 'Guru', icon: Users },
  { id: 'program', label: 'Program', icon: BookOpen },
  { id: 'yatim', label: 'Yatim', icon: Heart },
  { id: 'donasi', label: 'Donasi', icon: HandCoins },
  { id: 'laporan', label: 'Laporan Donasi', icon: ChartColumn },
  { id: 'berita', label: 'Berita', icon: Sparkles },
  { id: 'galeri', label: 'Galeri', icon: GalleryHorizontalEnd },
  { id: 'konten', label: 'Konten Islami', icon: Moon },
  { id: 'jadwal', label: 'Jadwal Sholat', icon: CalendarDays },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
]

/* ===== Chart komponen (SVG murni, ringan) ===== */
function BarChart({ data, color = '#124B3A' }: { data: { month: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value))
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
  const total = data.reduce((s, d) => s + d.value, 0)
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
              cx="60" cy="60" r={R} fill="none"
              stroke={d.color} strokeWidth="16" strokeLinecap="round"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          )
          offset += dash
          return el
        })}
        <text x="60" y="58" textAnchor="middle" className="fill-primary" fontSize="20" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
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

/* ===== Tabel ===== */
function DataTable<T extends { id: string }>({ rows, columns }: { rows: T[]; columns: { key: string; label: string; render: (r: T) => React.ReactNode }[] }) {
  return (
    <div className="thin-scroll overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-primary/5 text-xs uppercase tracking-wider text-ink-mute">
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-4 font-bold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-primary/5 transition-colors last:border-0 hover:bg-cream/60">
              {columns.map((c) => (
                <td key={c.key} className="px-6 py-4">{c.render(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Diterima': 'bg-softgreen text-primary',
    'Wawancara': 'bg-softyellow text-gold-ink',
    'Verifikasi': 'bg-softblue text-secondary-dark',
    'Baru': 'bg-softred text-warmred-dark',
    'Terkumpul': 'bg-softblue text-secondary-dark',
    'Tersalur': 'bg-softgreen text-primary',
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[status] ?? 'bg-cream text-ink-soft'}`}>
      {status}
    </span>
  )
}

/* ===== Panel ===== */
function DashboardPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((s) => (
          <div key={s.label} className="rounded-card bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-softgreen text-primary">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-softgreen px-2.5 py-1 text-xs font-bold text-primary">
                <ArrowUpRight className="h-3 w-3" /> {s.delta}
              </span>
            </div>
            <p className="mt-4 font-heading text-2xl font-extrabold text-primary">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-card bg-white p-6 shadow-soft">
          <h3 className="font-heading text-base font-extrabold text-primary">Pendaftaran Siswa (6 Bulan)</h3>
          <BarChart data={adminChart.pendaftaran} />
        </div>
        <div className="rounded-card bg-white p-6 shadow-soft">
          <h3 className="font-heading text-base font-extrabold text-primary">Donasi per Bulan (juta)</h3>
          <BarChart data={adminChart.donasiPerBulan} color="#F4C542" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-card bg-white p-6 shadow-soft">
          <h3 className="mb-5 font-heading text-base font-extrabold text-primary">Program Aktif</h3>
          <DonutChart data={adminChart.programAktif} />
        </div>
        <div className="rounded-card bg-white p-6 shadow-soft">
          <h3 className="font-heading text-base font-extrabold text-primary">Pendaftar Terbaru</h3>
          <ul className="mt-4 divide-y divide-primary/5">
            {adminPpdb.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold text-ink">{p.name}</p>
                  <p className="text-xs text-ink-mute">{p.id} • {p.program}</p>
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

function PpdPanel() {
  return (
    <div className="rounded-card bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-primary/5 px-6 py-5">
        <h3 className="font-heading text-base font-extrabold text-primary">Daftar Pendaftar PPDB 2026/2027</h3>
        <span className="rounded-full bg-softgreen px-3 py-1 text-xs font-bold text-primary">{adminPpdb.length} pendaftar</span>
      </div>
      <DataTable
        rows={adminPpdb}
        columns={[
          { key: 'id', label: 'No. Pendaftaran', render: (r) => <span className="font-bold text-primary">{r.id}</span> },
          { key: 'name', label: 'Nama', render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: 'program', label: 'Program', render: (r) => r.program },
          { key: 'date', label: 'Tanggal', render: (r) => r.date },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  )
}

function DonasiPanel() {
  return (
    <div className="rounded-card bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-primary/5 px-6 py-5">
        <h3 className="font-heading text-base font-extrabold text-primary">Donasi Terbaru</h3>
        <span className="rounded-full bg-softyellow px-3 py-1 text-xs font-bold text-gold-ink">{formatRupiah(adminDonations.reduce((s, d) => s + d.amount, 0))}</span>
      </div>
      <DataTable
        rows={adminDonations}
        columns={[
          { key: 'id', label: 'ID', render: (r) => <span className="font-bold text-primary">{r.id}</span> },
          { key: 'donor', label: 'Donatur', render: (r) => <span className="font-semibold text-ink">{r.donor}</span> },
          { key: 'program', label: 'Program', render: (r) => r.program },
          { key: 'amount', label: 'Nominal', render: (r) => <span className="font-extrabold text-primary">{formatRupiah(r.amount)}</span> },
          { key: 'date', label: 'Tanggal', render: (r) => r.date },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  )
}

function LaporanPanel() {
  const total = adminDonations.reduce((s, d) => s + d.amount, 0)
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-card bg-white p-6 shadow-soft">
        <h3 className="font-heading text-base font-extrabold text-primary">Rekap Donasi Bulan Ini</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {[
            { label: 'Total Terkumpul', value: formatRupiah(total) },
            { label: 'Transaksi', value: String(adminDonations.length) },
            { label: 'Rata-rata', value: formatRupiah(Math.round(total / adminDonations.length)) },
            { label: 'Tersalurkan', value: formatRupiah(Math.round(total * 0.62)) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">{s.label}</p>
              <p className="mt-1 font-heading text-lg font-extrabold text-primary">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-bold text-ink-soft">Donasi per Bulan (juta)</h4>
          <BarChart data={adminChart.donasiPerBulan} color="#3D82C6" />
        </div>
      </div>
      <div className="rounded-card bg-white p-6 shadow-soft">
        <h3 className="font-heading text-base font-extrabold text-primary">Distribusi Program</h3>
        <div className="mt-6"><DonutChart data={adminChart.programAktif} /></div>
      </div>
    </div>
  )
}

function PengaturanPanel() {
  return (
    <div className="max-w-2xl rounded-card bg-white p-8 shadow-soft">
      <h3 className="font-heading text-base font-extrabold text-primary">Pengaturan Akun</h3>
      <div className="mt-6 grid gap-4">
        {['Nama Admin', 'Email Admin', 'WhatsApp Yayasan'].map((label, i) => (
          <div key={label}>
            <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>
            <input
              type={i === 1 ? 'email' : 'text'}
              defaultValue={i === 0 ? 'Admin Yayasan' : i === 1 ? 'admin@yayasanmustam.id' : '6281234567890'}
              className="w-full rounded-xl border-2 border-primary/10 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
            />
          </div>
        ))}
        <button className="mt-2 w-fit rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:bg-primary-light">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  )
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card bg-white p-14 text-center shadow-soft">
      <Users className="h-10 w-10 text-ink-mute" />
      <h3 className="font-heading text-lg font-extrabold text-primary">{label}</h3>
      <p className="max-w-sm text-sm text-ink-mute">
        Panel ini siap diisi data dari backend. Data placeholder tersedia di <code className="rounded bg-cream px-1.5 py-0.5 text-xs">src/data/donations.ts</code>.
      </p>
    </div>
  )
}

export default function AdminDashboard() {
  useSEO({ title: 'Admin Dashboard', path: '/admin' })
  const [panel, setPanel] = useState<PanelId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const sidebarBtnRef = useRef<HTMLButtonElement | null>(null)

  // tutup sidebar mobile dengan Escape + fokus kembali ke tombol buka
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

  const activeLabel = useMemo(() => menu.find((m) => m.id === panel)?.label ?? 'Dashboard', [panel])

  const panelContent = (() => {
    switch (panel) {
      case 'dashboard': return <DashboardPanel />
      case 'ppdb': return <PpdPanel />
      case 'donasi': return <DonasiPanel />
      case 'laporan': return <LaporanPanel />
      case 'pengaturan': return <PengaturanPanel />
      case 'siswa': return <PlaceholderPanel label="Manajemen Siswa" />
      case 'guru': return <PlaceholderPanel label="Manajemen Guru" />
      case 'program': return <PlaceholderPanel label="Manajemen Program" />
      case 'yatim': return <PlaceholderPanel label="Manajemen Anak Yatim" />
      case 'berita': return <PlaceholderPanel label="Manajemen Berita" />
      case 'galeri': return <PlaceholderPanel label="Manajemen Galeri" />
      case 'konten': return <PlaceholderPanel label="Manajemen Konten Islami" />
      case 'jadwal': return <PlaceholderPanel label="Jadwal Sholat" />
    }
  })()

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <LogoEmblem size={40} />
        <div>
          <p className="font-heading text-base font-extrabold text-white">Yayasan Mustam</p>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu admin">
        {menu.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setPanel(m.id); setSidebarOpen(false) }}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              panel === m.id ? 'bg-gold text-primary shadow-soft' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            aria-current={panel === m.id ? 'page' : undefined}
          >
            <m.icon className="h-4.5 w-4.5" />
            <span className="flex-1 text-left">{m.label}</span>
            {m.badge && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${panel === m.id ? 'bg-primary text-white' : 'bg-white/15 text-white'}`}>
                {m.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <LogOut className="h-4.5 w-4.5" /> Kembali ke Website
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-cream">
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-primary-deep lg:block">
        {sidebar}
      </aside>

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
              className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary lg:hidden"
              aria-label="Buka menu admin"
              aria-expanded={sidebarOpen}
              aria-controls="menu-admin-mobile"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-semibold text-ink-mute">Admin / {activeLabel}</p>
              <h1 className="font-heading text-lg font-extrabold text-primary">{activeLabel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 text-primary transition-colors hover:bg-softgreen"
                aria-label="Notifikasi"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warmred" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl border border-primary/10 bg-white p-3 shadow-lift">
                  <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-ink-mute">Notifikasi</p>
                  <p className="rounded-xl bg-softgreen px-3 py-2.5 text-sm font-semibold text-primary">
                    5 pendaftar baru menunggu verifikasi.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-extrabold text-gold">AY</span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-ink">Admin Yayasan</p>
                <p className="text-xs text-ink-mute">admin@yayasanmustam.id</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-7">
          <h2 className="sr-only">Panel Dashboard</h2>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-mute">
              Selamat datang kembali, Admin! Ini ringkasan aktivitas yayasan hari ini.
            </p>
            <span className="rounded-full bg-softyellow px-4 py-2 text-xs font-bold text-gold-ink">
              {new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
            </span>
          </div>
          {panelContent}
        </main>
      </div>
    </div>
  )
}
