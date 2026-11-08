import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const Profil = lazy(() => import('./pages/Profil'))
const Sejarah = lazy(() => import('./pages/Sejarah'))
const VisiMisi = lazy(() => import('./pages/VisiMisi'))
const Organisasi = lazy(() => import('./pages/Organisasi'))
const Legalitas = lazy(() => import('./pages/Legalitas'))
const Fasilitas = lazy(() => import('./pages/Fasilitas'))
const Program = lazy(() => import('./pages/Program'))
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'))
const Kurikulum = lazy(() => import('./pages/Kurikulum'))
const Yatim = lazy(() => import('./pages/Yatim'))
const OrangTuaAsuh = lazy(() => import('./pages/OrangTuaAsuh'))
const Transparansi = lazy(() => import('./pages/Transparansi'))
const PPDB = lazy(() => import('./pages/PPDB'))
const PPDBDaftar = lazy(() => import('./pages/PPDBDaftar'))
const PPDBStatus = lazy(() => import('./pages/PPDBStatus'))
const Berita = lazy(() => import('./pages/Berita'))
const BeritaDetail = lazy(() => import('./pages/BeritaDetail'))
const Galeri = lazy(() => import('./pages/Galeri'))
const KontenIslami = lazy(() => import('./pages/KontenIslami'))
const Doa = lazy(() => import('./pages/Doa'))
const JadwalSholat = lazy(() => import('./pages/JadwalSholat'))
const Kontak = lazy(() => import('./pages/Kontak'))
const NotFound = lazy(() => import('./pages/NotFound'))

function AdminPortalRedirect() {
  const destination = import.meta.env.VITE_ADMIN_PORTAL_URL?.trim() || 'http://localhost:3000'
  useEffect(() => {
    window.location.replace(destination)
  }, [destination])
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6 text-center text-sm font-semibold text-primary">
      Membuka portal administrasi yang aman…
    </main>
  )
}

function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-cream px-6 text-center text-sm font-semibold text-primary">
      Memuat halaman…
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/sejarah" element={<Sejarah />} />
          <Route path="/visi-misi" element={<VisiMisi />} />
          <Route path="/organisasi" element={<Organisasi />} />
          <Route path="/legalitas" element={<Legalitas />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/program" element={<Program />} />
          <Route path="/program/:slug" element={<ProgramDetail />} />
          <Route path="/kurikulum" element={<Kurikulum />} />
          <Route path="/yatim" element={<Yatim />} />
          <Route path="/yatim/donasi" element={<Navigate to="/yatim" replace />} />
          <Route path="/yatim/orangtua-asuh" element={<OrangTuaAsuh />} />
          <Route path="/yatim/transparansi" element={<Transparansi />} />
          <Route path="/ppdb" element={<PPDB />} />
          <Route path="/ppdb/daftar" element={<PPDBDaftar />} />
          <Route path="/ppdb/status" element={<PPDBStatus />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:slug" element={<BeritaDetail />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/konten-islami" element={<KontenIslami />} />
          <Route path="/doa" element={<Doa />} />
          <Route path="/jadwal-sholat" element={<JadwalSholat />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminPortalRedirect />} />
      </Routes>
    </Suspense>
  )
}
