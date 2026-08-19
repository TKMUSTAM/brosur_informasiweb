import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll ke atas setiap berpindah halaman. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
