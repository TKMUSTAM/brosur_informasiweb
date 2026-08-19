import type { SceneName } from '../components/illustrations/Scene'

/** Map ikon program (string data) → scene ilustrasi */
export function iconToScene(icon: string): SceneName {
  switch (icon) {
    case 'quran': return 'quran'
    case 'blocks': return 'blocks'
    case 'pencil': return 'paint'
    case 'star': return 'math'
    default: return 'quran'
  }
}

/** Map slug berita → scene ilustrasi */
export function sceneForNewsSlug(slug: string): SceneName {
  if (slug.includes('murojaah')) return 'read'
  if (slug.includes('outing') || slug.includes('bakti')) return 'share'
  if (slug.includes('kajian')) return 'teacher'
  if (slug.includes('isra')) return 'mosque'
  if (slug.includes('penyaluran')) return 'share'
  return 'quran'
}
