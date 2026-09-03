// ============================================================
// SERVER LAYANAN INFORMASI — proxy /api/chat → Groq API
// ------------------------------------------------------------
// Node murni (tanpa dependency) agar mudah di-deploy di mana saja.
//
// Jalankan:
//   GROQ_API_KEY=xxx npm run server        # produksi (serves dist/)
//   GROQ_API_KEY=xxx npm run server:dev    # development (Vite proxy /api)
//
// API key HANYA dibaca di server ini — tidak pernah terekspos ke browser.
// ============================================================

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { knowledge } from './knowledge.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// ===== Muat .env manual (tanpa dependency) =====
function loadEnv() {
  const envPath = join(__dirname, '..', '.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}
loadEnv()

const PORT = Number(process.env.PORT || 8787)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_MODEL = process.env.GROQ_MODEL || 'groq/compound-mini'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const DIST_DIR = join(__dirname, '..', 'dist')

// ===== Konfigurasi =====
const MAX_HISTORY = 10 // jumlah pesan riwayat yang dikirim ke AI
const MAX_QUESTION = 800 // batas panjang pertanyaan (karakter)
const REQUEST_TIMEOUT_MS = 25_000
const RATE_LIMIT = { windowMs: 60_000, max: 30 } // 30 req/menit per IP

// ===== Rate limiter sederhana (in-memory, dengan pembersihan berkala) =====
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT.windowMs) {
    hits.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT.max
}
// bersihkan entri lama setiap 5 menit (cegah kebocoran memori)
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of hits) {
    if (now - entry.start > RATE_LIMIT.windowMs) hits.delete(ip)
  }
}, 5 * 60_000).unref()

/** Ambil IP klien, hormati header x-forwarded-for bila ada (di belakang proxy). */
function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) {
    const first = fwd.split(',')[0].trim()
    if (first) return first
  }
  return req.socket.remoteAddress || 'unknown'
}

// ===== System prompt =====
function buildSystemPrompt() {
  return [
    `Kamu adalah petugas layanan informasi resmi Yayasan Mustam bernama "Pusat Informasi".`,
    `Kamu menjawab pertanyaan orang tua dan calon donatur dengan bahasa Indonesia yang hangat, sopan, ramah, dan mudah dipahami.`,
    `Gunakan hanya informasi dari pengetahuan di bawah ini. Jika tidak tahu atau pertanyaan di luar pengetahuan, akui dengan jujur dan arahkan pengguna untuk menghubungi WhatsApp yayasan.`,
    `Jangan menyebut bahwa kamu adalah AI, model bahasa, atau chatbot. Jawablah seolah-olah kamu adalah staf layanan informasi yayasan.`,
    `Gunakan bahasa yang santun, jangan terlalu panjang (2–5 kalimat umumnya cukup), dan berikan detail jika diminta.`,
    `Untuk hal yang bisa dilakukan lewat website (daftar PPDB, donasi, dll), sebutkan halaman/aksi yang relevan.`,
    ``,
    `=== PENGETAHUAN YAYASAN ===`,
    knowledge,
    ``,
    `=== ATURAN TAMBAHAN ===`,
    `- Jika pengguna bertanya tentang jadwal sholat hari ini, sebutkan bahwa jadwal tersedia di halaman Jadwal Sholat dan dihitung otomatis berdasarkan lokasi.`,
    `- Jika pengguna menanyakan hal sensitif atau di luar konteks yayasan, tolak dengan sopan.`,
  ].join('\n')
}

// ===== Panggil Groq API =====
async function askGroq(messages) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Groq API ${res.status}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    let reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Groq API: balasan kosong')
    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    return reply
  } finally {
    clearTimeout(timer)
  }
}

// ===== Handler /api/chat =====
async function handleChat(req, res) {
  // baca body
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 200_000) {
      res.writeHead(413, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Payload terlalu besar' }))
      return
    }
  }
  let payload
  try {
    payload = JSON.parse(raw || '{}')
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'JSON tidak valid' }))
    return
  }

  const question = typeof payload.question === 'string' ? payload.question.trim() : ''
  const history = Array.isArray(payload.history) ? payload.history : []

  if (!question) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Pertanyaan wajib diisi' }))
    return
  }
  if (question.length > MAX_QUESTION) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: `Pertanyaan maksimal ${MAX_QUESTION} karakter` }))
    return
  }
  if (!GROQ_API_KEY) {
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'GROQ_API_KEY belum dikonfigurasi di server' }))
    return
  }

  // bangun riwayat chat yang aman (hanya role+content, dipotong)
  const safeHistory = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    ...safeHistory,
    { role: 'user', content: question },
  ]

  try {
    const reply = await askGroq(messages)
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ reply }))
  } catch (err) {
    console.error('[chat] Groq error:', err.message)
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Layanan sedang sibuk, coba lagi sebentar lagi' }))
  }
}

// ===== Static file server (produksi: serve dist/) =====
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

async function serveStatic(req, res, urlPath) {
  try {
    let pathname = decodeURIComponent(urlPath)
    if (pathname === '/') pathname = '/index.html'
    // cegah path traversal (cek prefix + pemisah direktori)
    const filePath = normalize(join(DIST_DIR, pathname))
    const sep = process.platform === 'win32' ? '\\' : '/'
    if (filePath !== DIST_DIR && !filePath.startsWith(DIST_DIR + sep)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }
    let data
    try {
      data = await readFile(filePath)
    } catch {
      // SPA fallback → index.html
      data = await readFile(join(DIST_DIR, 'index.html'))
    }
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': filePath.includes('assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    })
    res.end(data)
  } catch {
    res.writeHead(500)
    res.end('Internal Server Error')
  }
}

// ===== Server utama =====
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const ip = clientIp(req)

  // CORS (untuk development lintas origin)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // health check
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, model: GROQ_MODEL, hasKey: Boolean(GROQ_API_KEY) }))
    return
  }

  // chat API
  if (url.pathname === '/api/chat') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Method tidak diizinkan' }))
      return
    }
    if (rateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Terlalu banyak permintaan, coba lagi beberapa saat' }))
      return
    }
    await handleChat(req, res)
    return
  }

  // endpoint API yang tidak dikenal → 404, bukan index.html
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Endpoint tidak ditemukan' }))
    return
  }

  // static (hanya jika dist/ ada)
  if (req.method === 'GET') {
    await serveStatic(req, res, url.pathname)
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Tidak ditemukan' }))
})

server.listen(PORT, () => {
  console.log(`[server] Pusat Informasi server jalan di http://localhost:${PORT}`)
  console.log(`[server] Model: ${GROQ_MODEL} | API key: ${GROQ_API_KEY ? '[terpasang]' : '[belum dikonfigurasi]'}`)
  console.log(`[server] Mode: ${process.argv.includes('--serve-dist') ? 'produksi (serves dist/)' : 'API only (Vite proxy /api)'}`)
})
