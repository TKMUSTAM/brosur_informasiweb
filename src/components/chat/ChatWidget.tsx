import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, Clock, MessageCircle, Phone, X } from 'lucide-react'
import { LogoEmblem } from '../Logo'
import { typingDelay } from '../../lib/chatEngine'
import { askAssistant, type ChatMessage } from '../../lib/aiChat'
import { quickReplies, type ChatLink } from '../../data/faq'
import { site } from '../../data/site'

type Message = {
  id: number
  role: 'user' | 'bot'
  text: string
  links?: ChatLink[]
  suggestions?: string[]
}

const WELCOME: Message = {
  id: 0,
  role: 'bot',
  text:
    'Assalamualaikum! Selamat datang di Pusat Layanan Informasi Yayasan & TK Islam Al-Mustam. Ada yang bisa kami bantu mengenai pendaftaran (PPDB), kurikulum 5 sentra, biaya sekolah, atau kunjungan kampus?',
  suggestions: quickReplies.slice(0, 4),
}

let msgId = 1

/**
 * Widget layanan informasi — dirancang seperti chat layanan pelanggan
 * yayasan (bukan asisten AI) agar terasa personal dan profesional.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  // penanda sesi percakapan: mencegah jawaban AI masuk setelah panel ditutup / halaman pindah
  const sessionRef = useRef(0)

  const closePanel = () => {
    sessionRef.current += 1 // batalkan semua respons AI yang sedang berjalan
    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current)
      typingTimer.current = null
    }
    setTyping(false)
    setOpen(false)
  }

  // scroll ke bawah saat ada pesan baru / indikator mengetik
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  // fokus input + tutup dengan Esc + focus trap ringan
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 260)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel()
        return
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pushBot = (text: string, links?: ChatLink[], suggestions?: string[]) => {
    setMessages((m) => [...m, { id: msgId++, role: 'bot', text, links, suggestions }])
  }

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    setMessages((m) => [...m, { id: msgId++, role: 'user', text }])
    setInput('')
    setTyping(true)

    // riwayat singkat untuk konteks AI (dari pesan yang sudah ada)
    const history: ChatMessage[] = messages
      .filter((m) => m.role !== 'bot' || m.id !== 0)
      .filter((m) => m.role === 'user' || (m.role === 'bot' && m.text && m.text.length > 2))
      .slice(-10)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

    const delay = typingDelay(text)
    const session = sessionRef.current
    typingTimer.current = window.setTimeout(async () => {
      typingTimer.current = null
      const answer = await askAssistant(history, text)
      // panel ditutup / sesi berganti selama menunggu → buang jawaban
      if (session !== sessionRef.current) return
      pushBot(answer.text, answer.links, answer.suggestions)
      setTyping(false)
    }, delay)
  }

  const askSuggestion = (q: string) => send(q)

  return (
    <div className="fixed z-[70]">
      {/* ===== Panel ===== */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Pusat Informasi Yayasan Mustam"
          className="chat-pop fixed inset-x-3 bottom-[6.5rem] flex max-h-[calc(100dvh-8.5rem)] flex-col overflow-hidden rounded-card-lg border border-primary/10 bg-white shadow-lift sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[400px] sm:max-h-[calc(100dvh-8rem)]"
        >
          {/* ===== Header ===== */}
          <header className="flex items-center gap-3 border-b border-primary/5 bg-cream px-4 py-3.5">
            <LogoEmblem size={42} />
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-heading text-base font-extrabold text-primary">Pusat Informasi</h2>
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink-mute">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-mint opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-mint" />
                </span>
                Admin online — balasan cepat
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Tutup layanan informasi"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* ===== Pesan ===== */}
          <div
            ref={scrollRef}
            className="thin-scroll min-h-40 flex-1 space-y-3.5 overflow-y-auto bg-cream/70 px-4 py-5"
            aria-live="polite"
          >
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="msg-in flex justify-end">
                  <div className="max-w-[82%] break-words rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-white shadow-soft">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="msg-in space-y-2">
                  <div className="flex items-end gap-2.5">
                    <BotAvatar />
                    <div className="max-w-[82%] whitespace-pre-line break-words rounded-2xl rounded-bl-md border border-primary/5 bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-soft">
                      {m.text}
                    </div>
                  </div>
                  {m.links && m.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {m.links.map((l) => (
                        <Link
                          key={l.href}
                          to={l.href}
                          onClick={() => setOpen(false)}
                          className="group inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-softgreen"
                        >
                          {l.label}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => askSuggestion(s)}
                          className="rounded-full border border-gold/50 bg-softyellow px-3.5 py-1.5 text-xs font-semibold text-gold-ink transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-soft"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {typing && (
              <div className="msg-in flex items-end gap-2.5">
                <BotAvatar />
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-primary/5 bg-white px-4 py-3.5 shadow-soft" aria-label="Admin sedang mengetik">
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary-mint" style={{ animationDelay: '0ms' }} />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary-mint" style={{ animationDelay: '150ms' }} />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary-mint" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* ===== Input ===== */}
          <div className="border-t border-primary/5 bg-white px-3.5 py-3">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pertanyaan Anda…"
                aria-label="Tulis pertanyaan"
                className="min-w-0 flex-1 rounded-full border border-primary/10 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-mute/70 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-soft transition-all hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Kirim pesan"
              >
                <ArrowUp className="h-4.5 w-4.5" />
              </button>
            </form>
            <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] font-medium text-ink-mute">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Senin–Jumat, 07.00–15.00 WIB
              </span>
              <a
                href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Assalamualaikum, saya ingin bertanya tentang Yayasan Mustam.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-bold text-primary transition-colors hover:text-primary-light"
              >
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== Tombol buka + Tooltip Callout ===== */}
      {!open && (
        <div className="fixed bottom-24 right-4 z-[70] flex items-center gap-3 sm:bottom-6 sm:right-6">
          <div className="hidden items-center gap-2 rounded-2xl border border-primary/15 bg-white/95 px-3.5 py-2 shadow-lift backdrop-blur-md transition-all sm:flex animate-float">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-mint" />
            </span>
            <span className="text-xs font-bold text-primary">Tanya PPDB &amp; Info Sekolah</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="chat-pop group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-lift ring-4 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold"
            aria-label="Buka Pusat Informasi"
            aria-expanded={false}
          >
            <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-black text-primary-deep shadow-soft">
              1
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

function BotAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-softgreen shadow-soft">
      <LogoEmblem size={26} />
    </span>
  )
}
