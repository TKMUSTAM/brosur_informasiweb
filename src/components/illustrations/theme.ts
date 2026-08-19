// ============================================================
// TEMA ILUSTRASI — palet warna & konstanta bersama
// ============================================================

export type SceneName =
  | 'quran'
  | 'read'
  | 'blocks'
  | 'mosque'
  | 'nature'
  | 'pray'
  | 'share'
  | 'paint'
  | 'books'
  | 'hands'
  | 'play'
  | 'teacher'
  | 'math'

export type PaletteKey = 'green' | 'blue' | 'gold' | 'red' | 'mixed'

export type Palette = {
  bg: string
  main: string
  soft: string
  accent: string
  ink: string
  alt: string
}

export const PALETTES: Record<PaletteKey, Palette> = {
  green: { bg: '#EAF4EE', main: '#124B3A', soft: '#BFE0D1', accent: '#F4C542', ink: '#0C3529', alt: '#3D82C6' },
  blue: { bg: '#EAF3FB', main: '#2F6AA4', soft: '#C3DDF4', accent: '#F4C542', ink: '#1D4E7E', alt: '#124B3A' },
  gold: { bg: '#FFF5C9', main: '#B98A1D', soft: '#F5E39A', accent: '#124B3A', ink: '#8A6512', alt: '#C94C4C' },
  red: { bg: '#FBE9E9', main: '#B84444', soft: '#F0C4C4', accent: '#124B3A', ink: '#8F3333', alt: '#3D82C6' },
  mixed: { bg: '#EAF4EE', main: '#124B3A', soft: '#C3DDF4', accent: '#F4C542', ink: '#0C3529', alt: '#3D82C6' },
}

export const SKIN = '#F2C79B'
export const SKIN_SHADE = '#E0AC7F'
