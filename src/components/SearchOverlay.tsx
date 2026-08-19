import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, FileText, Home, Search, Sparkles, X } from 'lucide-react'
import { searchAll, type SearchResult } from '../data/searchIndex'

const groupMeta: Record<SearchResult['group'], { icon: typeof BookOpen; label: string; color: string }> = {
  Program: { icon: BookOpen, label: 'Program', color: 'bg-softgreen text-primary' },
  Berita: { icon: FileText, label: 'Berita', color: 'bg-softblue text-secondary-dark' },
  'Konten Islami': { icon: Sparkles, label: 'Konten Islami', color: 'bg-softyellow text-gold-ink' },
  Halaman: { icon: Home, label: 'Halaman', color: 'bg-cream-dark text-ink-soft' },
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const results = useMemo(() => (open ? searchAll(query) : []), [open, query])

  // jaga index aktif tetap valid saat hasil menyusut
  useEffect(() => {
    if (active >= results.length) setActive(Math.max(0, results.length - 1))
  }, [results.length, active])

  // reset saat dibuka
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [open])

  // kunci scroll body
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // tutup dengan Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  const go = (r: SearchResult) => {
    onClose()
    navigate(r.href)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active])
    }
  }

  // focus trap minimal: Tab/Shift+Tab bersiklus di dalam panel
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || results.length === 0) return
    const focusables = [
      inputRef.current,
      ...(listRef.current?.querySelectorAll<HTMLElement>('ul button') ?? []),
      listRef.current?.querySelector('button[aria-label="Tutup"]'),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement)
    if (focusables.length < 2) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const current = document.activeElement
    if (e.shiftKey && (current === first || current === inputRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && current === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // jaga item aktif tetap terlihat saat navigasi keyboard
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Cari di website"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Tutup pencarian"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-primary-deep/60 backdrop-blur-sm"
      />

      {/* panel */}
      <div
        ref={listRef}
        onKeyDown={onPanelKeyDown}
        className="dropdown-in relative w-full max-w-xl overflow-hidden rounded-none border border-primary/10 bg-white shadow-lift"
      >
        {/* input */}
        <div className="flex items-center gap-3 border-b border-primary/5 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari program, berita, doa, artikel…"
            className="w-full bg-transparent text-base font-medium text-ink outline-none placeholder:text-ink-mute/60"
            aria-label="Kata kunci pencarian"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream text-ink-soft transition-colors hover:bg-softred hover:text-warmred"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* hasil */}
        {results.length > 0 ? (
          <ul className="max-h-[52vh] overflow-y-auto p-2">
            {results.map((r, i) => {
              const meta = groupMeta[r.group]
              const Icon = meta.icon
              const isActive = i === active
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    data-idx={i}
                    onClick={() => go(r)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                      isActive ? 'bg-softgreen' : 'hover:bg-cream'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}
                      aria-hidden="true"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-sm font-bold text-ink ${isActive ? 'text-primary' : ''}`}>
                          {r.title}
                        </span>
                        {r.badge && (
                          <span className="shrink-0 rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-bold text-ink-mute">
                            {r.badge}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-mute">{r.description}</span>
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-all ${
                        isActive ? 'translate-x-0 text-primary opacity-100' : '-translate-x-1 text-ink-mute opacity-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-ink">Tidak ada hasil untuk “{query}”</p>
            <p className="mt-1 text-xs text-ink-mute">Coba kata kunci lain, mis. “PPDB”, “doa”, atau “yatim”.</p>
          </div>
        )}

        {/* footer hint */}
        <div className="flex items-center justify-between border-t border-primary/5 bg-cream px-5 py-2.5 text-[11px] text-ink-mute">
          <span className="flex items-center gap-3">
            <span>
              <kbd className="rounded-md bg-white px-1.5 py-0.5 font-bold shadow-soft">↑</kbd>{' '}
              <kbd className="rounded-md bg-white px-1.5 py-0.5 font-bold shadow-soft">↓</kbd> navigasi
            </span>
            <span>
              <kbd className="rounded-md bg-white px-1.5 py-0.5 font-bold shadow-soft">Enter</kbd> buka
            </span>
            <span>
              <kbd className="rounded-md bg-white px-1.5 py-0.5 font-bold shadow-soft">Esc</kbd> tutup
            </span>
          </span>
          <span className="hidden sm:block">Pencarian cepat {results.length} hasil</span>
        </div>
      </div>
    </div>
  )
}
