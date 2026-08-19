import { findAnswer } from './chatEngine'
import type { ChatLink } from '../data/faq'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type AIChatResult = {
  /** sumber jawaban: 'ai' (Groq via server) atau 'fallback' (engine lokal) */
  source: 'ai' | 'fallback'
  text: string
  links?: ChatLink[]
  suggestions?: string[]
}

const API_TIMEOUT_MS = 15_000

/**
 * Minta jawaban ke asisten AI melalui proxy server (/api/chat).
 * Jika server mati / timeout / error → otomatis fallback ke engine
 * keyword lokal agar chatbot tetap berfungsi.
 */
export async function askAssistant(history: ChatMessage[], question: string): Promise<AIChatResult> {
  // engine lokal selalu dihitung sebagai cadangan (dan untuk links/suggestions)
  const local = findAnswer(question)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: history.slice(-8) }),
        signal: controller.signal,
      })
      if (!res.ok) return toFallback(local)
      const data = (await res.json()) as { reply?: string; error?: string }
      if (!data.reply) return toFallback(local)
      return {
        source: 'ai',
        text: data.reply,
        // link/saran navigasi tetap dari engine lokal agar selalu akurat
        links: local.intent.links,
        suggestions: local.intent.suggestions,
      }
    } finally {
      clearTimeout(timer)
    }
  } catch {
    // network error / timeout → fallback
    return toFallback(local)
  }
}

function toFallback(local: ReturnType<typeof findAnswer>): AIChatResult {
  return {
    source: 'fallback',
    text: local.intent.answer,
    links: local.intent.links,
    suggestions: local.intent.suggestions,
  }
}

/** Status koneksi server AI (untuk indikator kecil di UI). */
export async function checkAIHealth(): Promise<{ ok: boolean; model?: string; hasKey?: boolean }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    try {
      const res = await fetch('/api/health', { signal: controller.signal })
      if (!res.ok) return { ok: false }
      return (await res.json()) as { ok: boolean; model?: string; hasKey?: boolean }
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return { ok: false }
  }
}
