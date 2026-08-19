import { useEffect } from 'react'

const BASE_TITLE = 'Yayasan Mustam'
const BASE_DESC =
  'Yayasan Pendidikan Islam yang menaungi TPA, KB, TK A, TK B serta program pendidikan dan pembinaan yatim piatu.'

type SEOOptions = {
  title: string
  description?: string
  path?: string
}

/**
 * Mengatur document title + meta description/OG per halaman.
 * SPA-only: untuk SEO maksimal disarankan static export / prerender.
 */
export function useSEO({ title, description = BASE_DESC, path = '/' }: SEOOptions) {
  useEffect(() => {
    document.title = title === BASE_TITLE ? BASE_TITLE : `${title} — ${BASE_TITLE}`

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', document.title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `https://yayasanmustam.id${path}`)
  }, [title, description, path])
}
