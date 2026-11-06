import type { ComponentType } from 'react'
import {
  RiHome5Line,
  RiSchoolLine,
  RiBuildingLine,
  RiCompass3Line,
  RiHistoryLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiBuilding4Line,
  RiBookOpenLine,
  RiStackLine,
  RiBearSmileLine,
  RiBookmarkLine,
  RiUserAddLine,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiFileEditLine,
  RiHeartLine,
  RiNewspaperLine,
  RiImageLine,
  RiPhoneLine,
  RiSearchLine,
  RiArrowRightLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiCalendar2Line,
  RiCheckLine,
  RiAwardLine,
  RiQuestionLine,
  RiLightbulbLine,
} from 'react-icons/ri'
import {
  FaBookQuran,
  FaHandsPraying,
  FaMosque,
  FaSchool,
  FaUserGraduate,
  FaClock,
  FaLocationDot,
  FaShapes,
  FaHeart,
  FaStar,
} from 'react-icons/fa6'

export type IconComponent = ComponentType<{ className?: string; size?: number | string }>

/**
 * Pemetaan icon react-icons (https://react-icons.github.io/react-icons/)
 * yang disesuaikan secara kontekstual dengan judul halaman, menu, atau kata kunci.
 */
export const TITLE_ICON_MAP: Record<string, IconComponent> = {
  // Menu Utama
  'beranda': RiHome5Line,
  'profil': RiSchoolLine,
  'pendidikan': RiBookOpenLine,
  'program': RiBookOpenLine,
  'ppdb': RiUserAddLine,
  'khazanah': FaMosque,
  'aktivitas': RiNewspaperLine,
  'kontak': RiPhoneLine,

  // Profil Submenu
  'tentang': RiBuildingLine,
  'yayasan': FaSchool,
  'visi': RiCompass3Line,
  'misi': RiCompass3Line,
  'sejarah': RiHistoryLine,
  'pendidik': RiTeamLine,
  'guru': RiTeamLine,
  'organisasi': RiTeamLine,
  'legalitas': RiShieldCheckLine,
  'akreditasi': RiAwardLine,
  'fasilitas': RiBuilding4Line,

  // Pendidikan Submenu
  'jenjang': RiStackLine,
  'playgroup': RiBearSmileLine,
  'kb': RiBearSmileLine,
  'tk a': RiBookmarkLine,
  'tk b': FaUserGraduate,
  'tpa': FaBookQuran,
  'tahfidz': FaBookQuran,
  'qur’an': FaBookQuran,
  'quran': FaBookQuran,
  'kurikulum': FaShapes,
  'sentra': FaShapes,

  // PPDB Submenu
  'alur': RiInformationLine,
  'informasi': RiInformationLine,
  'biaya': RiMoneyDollarCircleLine,
  'syarat': RiMoneyDollarCircleLine,
  'formulir': RiFileEditLine,
  'daftar': RiUserAddLine,
  'yatim': RiHeartLine,
  'dhuafa': FaHeart,
  'bantuan': RiHeartLine,

  // Khazanah & Aktivitas Submenu
  'berita': RiNewspaperLine,
  'agenda': RiCalendar2Line,
  'kajian': FaMosque,
  'galeri': RiImageLine,
  'foto': RiImageLine,
  'doa': FaHandsPraying,
  'sholat': FaClock,
  'jadwal': FaClock,
  'kalender': RiCalendar2Line,
  'hijriyah': RiCalendar2Line,

  // Kontak & Lokasi
  'lokasi': FaLocationDot,
  'alamat': FaLocationDot,
  'telepon': RiPhoneLine,
}

/**
 * Mencari icon react-icons yang paling cocok berdasarkan teks atau judul halaman.
 */
export function getPageIcon(titleOrKeyword: string): IconComponent {
  const normalized = titleOrKeyword.toLowerCase().trim()
  
  // 1. Cek kecocokan langsung
  if (TITLE_ICON_MAP[normalized]) {
    return TITLE_ICON_MAP[normalized]
  }

  // 2. Cek apakah ada kata kunci yang cocok
  for (const [keyword, Icon] of Object.entries(TITLE_ICON_MAP)) {
    if (normalized.includes(keyword)) {
      return Icon
    }
  }

  // Default fallback: Buku pengetahuan islami (elegan, tanpa bintang)
  return RiBookOpenLine
}

export function PageIcon({
  title,
  className = 'h-5 w-5',
  size,
}: {
  title: string
  className?: string
  size?: number | string
}) {
  const Icon = getPageIcon(title)
  return <Icon className={className} size={size} />
}

export {
  RiHome5Line,
  RiSchoolLine,
  RiBuildingLine,
  RiCompass3Line,
  RiHistoryLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiBuilding4Line,
  RiBookOpenLine,
  RiStackLine,
  RiBearSmileLine,
  RiBookmarkLine,
  RiUserAddLine,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiFileEditLine,
  RiHeartLine,
  RiNewspaperLine,
  RiImageLine,
  RiPhoneLine,
  RiSearchLine,
  RiArrowRightLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiCalendar2Line,
  RiCheckLine,
  RiAwardLine,
  RiQuestionLine,
  RiLightbulbLine,
  FaBookQuran,
  FaHandsPraying,
  FaMosque,
  FaSchool,
  FaUserGraduate,
  FaClock,
  FaLocationDot,
  FaShapes,
  FaHeart,
  FaStar,
}

