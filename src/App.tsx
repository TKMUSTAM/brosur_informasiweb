import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Profil from './pages/Profil'
import Sejarah from './pages/Sejarah'
import VisiMisi from './pages/VisiMisi'
import Organisasi from './pages/Organisasi'
import Legalitas from './pages/Legalitas'
import Fasilitas from './pages/Fasilitas'
import Program from './pages/Program'
import ProgramDetail from './pages/ProgramDetail'
import Kurikulum from './pages/Kurikulum'
import Yatim from './pages/Yatim'
import OrangTuaAsuh from './pages/OrangTuaAsuh'
import Transparansi from './pages/Transparansi'
import PPDB from './pages/PPDB'
import PPDBDaftar from './pages/PPDBDaftar'
import Berita from './pages/Berita'
import BeritaDetail from './pages/BeritaDetail'
import Galeri from './pages/Galeri'
import KontenIslami from './pages/KontenIslami'
import Doa from './pages/Doa'
import JadwalSholat from './pages/JadwalSholat'
import Kontak from './pages/Kontak'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
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
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:slug" element={<BeritaDetail />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/konten-islami" element={<KontenIslami />} />
        <Route path="/doa" element={<Doa />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}
