// ============================================================
// INDEKS PENCARIAN — gabungan program, berita, konten islami,
// doa, dan halaman statis. Dipakai oleh SearchOverlay di navbar.
// ============================================================

import { programs } from './programs'
import { news } from './news'
import { islamicArticles, doas } from './content'
import { navItems } from './site'

export type SearchResult = {
  id: string
  title: string
  description: string
  href: string
  group: 'Program' | 'Berita' | 'Konten Islami' | 'Halaman'
  badge?: string
}

// halaman statis yang layak dicari (diambil dari navigasi + halaman penting)
const staticPages: Omit<SearchResult, 'id'>[] = [
  { title: 'PPDB — Pendaftaran Peserta Didik Baru', description: 'Alur, jadwal, syarat, dan formulir pendaftaran 2026/2027.', href: '/ppdb', group: 'Halaman' },
  { title: 'Formulir Pendaftaran PPDB', description: 'Daftar online untuk TPA, KB, TK A, dan TK B.', href: '/ppdb/daftar', group: 'Halaman' },
  { title: 'Program Yatim Piatu', description: 'Beasiswa pendidikan & pembinaan anak yatim piatu 100% gratis.', href: '/yatim', group: 'Halaman' },
  { title: 'Orang Tua Asuh', description: 'Program wali asuh untuk mendampingi masa depan santri yatim.', href: '/yatim/orangtua-asuh', group: 'Halaman' },
  { title: 'Kurikulum', description: 'Kurikulum Merdeka & muatan diniyah.', href: '/kurikulum', group: 'Halaman' },
  { title: 'Galeri', description: 'Foto-foto kegiatan pembelajaran dan momen sekolah.', href: '/galeri', group: 'Halaman' },
  { title: 'Jadwal Sholat', description: 'Jadwal sholat harian berdasarkan lokasi.', href: '/jadwal-sholat', group: 'Halaman' },
  { title: 'Kontak', description: 'Alamat, WhatsApp, email, dan peta lokasi yayasan.', href: '/kontak', group: 'Halaman' },
  { title: 'Berita & Kegiatan', description: 'Kabar terbaru dari yayasan.', href: '/berita', group: 'Halaman' },
  { title: 'Konten Islami', description: 'Doa harian, jadwal sholat, dan artikel parenting Islami.', href: '/konten-islami', group: 'Halaman' },
]

// perkuat indeks dengan halaman turunan dari nav (profil, sejarah, dll.),
// lalu buang duplikat berdasarkan href agar satu halaman muncul sekali.
const seen = new Set(staticPages.map((p) => p.href))
for (const item of navItems) {
  if (!seen.has(item.href)) {
    staticPages.push({
      title: item.label,
      description: item.children ? `Lihat: ${item.children.slice(0, 4).map((c) => c.label).join(', ')}` : 'Halaman yayasan.',
      href: item.href,
      group: 'Halaman',
    })
    seen.add(item.href)
  }
  for (const child of item.children ?? []) {
    if (seen.has(child.href)) continue
    staticPages.push({
      title: child.label,
      description: `Bagian dari ${item.label}.`,
      href: child.href,
      group: 'Halaman',
    })
    seen.add(child.href)
  }
}

// ===== normalisasi: lowercase + buang aksen & tanda baca =====
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // buang diakritik
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildIndex(): SearchResult[] {
  const out: SearchResult[] = []

  for (const p of programs) {
    out.push({
      id: `program-${p.slug}`,
      title: `${p.code} — ${p.name}`,
      description: `${p.age} • ${p.subtitle}`,
      href: `/program/${p.slug}`,
      group: 'Program',
      badge: p.code,
    })
  }

  for (const n of news) {
    out.push({
      id: `berita-${n.slug}`,
      title: n.title,
      description: `${n.category} • ${n.date}`,
      href: `/berita/${n.slug}`,
      group: 'Berita',
      badge: n.category,
    })
  }

  for (const a of islamicArticles) {
    out.push({
      id: `artikel-${a.slug}`,
      title: a.title,
      description: `${a.category} • ${a.readTime}`,
      href: '/konten-islami#artikel',
      group: 'Konten Islami',
      badge: a.category,
    })
  }

  for (const d of doas) {
    out.push({
      id: `doa-${d.slug}`,
      title: d.title,
      description: d.category,
      href: '/doa',
      group: 'Konten Islami',
      badge: 'Doa',
    })
  }

  for (const [i, page] of staticPages.entries()) {
    out.push({ ...page, id: `page-${i}` })
  }

  return out
}

const index = buildIndex()

/**
 * Cari di seluruh indeks. query kosong → daftar populer (terbatas).
 * Skor: judul > deskripsi, dan awalan kata > substring.
 */
export function searchAll(query: string, limit = 8): SearchResult[] {
  const q = normalize(query)

  if (!q) {
    // fallback: tampilkan program + berita terbaru sebagai saran
    return index.filter((r) => r.group !== 'Halaman').slice(0, limit)
  }

  const scored = index
    .map((item) => {
      const title = normalize(item.title)
      const desc = normalize(item.description)
      let score = 0
      if (title.includes(q)) score += 10
      if (desc.includes(q)) score += 4
      // awalan kata mendapat bonus (mis. "tk" cocok dengan "tk a")
      const titleWords = title.split(' ')
      if (titleWords.some((w) => w.startsWith(q))) score += 3
      if (q.length >= 3) {
        if (item.badge && normalize(item.badge).includes(q)) score += 6
      }
      return { item, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item)

  return scored
}
