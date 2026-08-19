import { chatIntents, FALLBACK, type ChatIntent } from '../data/faq'

export type ChatResult = {
  intent: ChatIntent
  confidence: number
  matched: string[]
}

/** Normalisasi teks: lowercase, buang tanda baca, rapikan spasi. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Mencari intent terbaik untuk pertanyaan pengguna.
 * Skor = jumlah bobot kata kunci yang cocok (strong ×3, biasa = panjang kata).
 * Kata kunci lebih panjang = lebih spesifik = bobot lebih besar.
 */
export function findAnswer(input: string): ChatResult {
  const q = normalize(input)
  if (!q) return { intent: FALLBACK, confidence: 0, matched: [] }

  let best: ChatIntent | null = null
  let bestScore = 0
  let bestMatched: string[] = []

  for (const intent of chatIntents) {
    let score = 0
    const matched: string[] = []
    for (const kw of intent.strong ?? []) {
      if (q.includes(normalize(kw))) {
        score += normalize(kw).length * 3
        matched.push(kw)
      }
    }
    for (const kw of intent.keywords) {
      const nk = normalize(kw)
      if (q.includes(nk)) {
        score += nk.length
        matched.push(kw)
      }
    }
    // tie-break: intent dengan kata kunci lebih banyak dianggap lebih spesifik
    if (
      score > bestScore ||
      (score === bestScore && score > 0 && matched.length > bestMatched.length)
    ) {
      best = intent
      bestScore = score
      bestMatched = matched
    }
  }

  return {
    intent: best ?? FALLBACK,
    confidence: bestScore,
    matched: bestMatched,
  }
}

/** Waktu tunggu "mengetik" yang terasa alami (dalam ms). */
export function typingDelay(input: string): number {
  const len = input.trim().length
  return Math.min(1400, 650 + len * 18)
}
