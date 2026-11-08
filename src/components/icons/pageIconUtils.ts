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
  RiCalendar2Line,
  RiAwardLine,
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
} from 'react-icons/fa6'

export type IconComponent = ComponentType<{ className?: string; size?: number | string }>

export const TITLE_ICON_MAP: Record<string, IconComponent> = {
  'beranda': RiHome5Line,
  'profil': RiSchoolLine,
  'pendidikan': RiBookOpenLine,
  'program': RiBookOpenLine,
  'ppdb': RiUserAddLine,
  'khazanah': FaMosque,
  'aktivitas': RiNewspaperLine,
  'kontak': RiPhoneLine,
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
  'alur': RiInformationLine,
  'informasi': RiInformationLine,
  'biaya': RiMoneyDollarCircleLine,
  'syarat': RiMoneyDollarCircleLine,
  'formulir': RiFileEditLine,
  'daftar': RiUserAddLine,
  'status': RiSearchLine,
  'yatim': RiHeartLine,
  'dhuafa': FaHeart,
  'bantuan': RiHeartLine,
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
  'lokasi': FaLocationDot,
  'alamat': FaLocationDot,
  'telepon': RiPhoneLine,
}

export function getPageIcon(titleOrKeyword: string): IconComponent {
  const normalized = titleOrKeyword.toLowerCase().trim()

  if (TITLE_ICON_MAP[normalized]) {
    return TITLE_ICON_MAP[normalized]
  }

  for (const [keyword, Icon] of Object.entries(TITLE_ICON_MAP)) {
    if (normalized.includes(keyword)) {
      return Icon
    }
  }

  return RiBookOpenLine
}
