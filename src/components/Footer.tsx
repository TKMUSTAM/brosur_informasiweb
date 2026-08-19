import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ArrowUpRight, Award, ShieldCheck, Heart } from 'lucide-react'
import Logo, { LogoEmblem } from './Logo'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons'
import { site } from '../data/site'

const footerColumns = [
  {
    title: 'Profil Yayasan',
    links: [
      { label: 'Tentang Yayasan & TK', href: '/profil' },
      { label: 'Sejarah Lembaga', href: '/sejarah' },
      { label: 'Visi, Misi & 7 Pilar', href: '/visi-misi' },
      { label: 'Struktur & Guru S1 PAUD', href: '/organisasi' },
      { label: 'Legalitas & Akreditasi', href: '/legalitas' },
      { label: 'Fasilitas Kampus', href: '/fasilitas' },
    ],
  },
  {
    title: 'Program Pendidikan',
    links: [
      { label: 'Semua Jenjang Kelas', href: '/program' },
      { label: 'Playgroup / KB (3–4 Th)', href: '/program/kb' },
      { label: 'TK A (4–5 Th)', href: '/program/tk-a' },
      { label: 'TK B Persiapan SD (5–6 Th)', href: '/program/tk-b' },
      { label: 'TPA & Tahfidz Cilik', href: '/program/tpa' },
      { label: 'Kurikulum & 5 Sentra', href: '/kurikulum' },
    ],
  },
  {
    title: 'Layanan PPDB',
    links: [
      { label: 'Informasi PPDB 2026/2027', href: '/ppdb' },
      { label: 'Formulir Pendaftaran Online', href: '/ppdb/daftar' },
      { label: 'Rincian Biaya Transparan', href: '/ppdb#syarat' },
      { label: 'Jadwal Gelombang & Syarat', href: '/ppdb#syarat' },
      { label: 'Berita & Kegiatan', href: '/berita' },
      { label: 'Galeri Foto Aktivitas', href: '/galeri' },
    ],
  },
  {
    title: 'Program Sosial & Khazanah',
    links: [
      { label: 'Beasiswa Penuh Yatim & Dhuafa', href: '/yatim' },
      { label: 'Program Orang Tua Asuh', href: '/yatim/orangtua-asuh' },
      { label: 'Khazanah Konten Islami', href: '/konten-islami' },
      { label: 'Kumpulan Doa Harian', href: '/doa' },
      { label: 'Jadwal Sholat Real-Time', href: '/jadwal-sholat' },
      { label: 'Hubungi Sekretariat', href: '/kontak' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-primary-deep text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-10 opacity-[0.04]">
        <LogoEmblem size={260} light />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-16 sm:px-6">
        
        {/* TOP: Identity + Navigation Columns */}
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2.75fr]">
          
          <div className="flex flex-col gap-6">
            <Logo light />
            
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              {site.description}
            </p>

            {/* Accreditation Badge */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-primary-deep">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-gold-light">{site.accreditation}</p>
                <p className="text-[11px] text-white/70">NPSN: {site.npsn} • Kemendikbudristek &amp; Kemenag</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
                { icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
                { icon: YoutubeIcon, href: site.social.youtube, label: 'YouTube' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-primary-deep"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>

            {/* Address box */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light">
                <MapPin className="h-3.5 w-3.5" /> Alamat Kampus
              </p>
              <p className="text-xs leading-relaxed text-white/80">{site.contact.address}</p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={`Footer — ${col.title}`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-gold-light">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        to={l.href}
                        className="group inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-gold sm:text-sm"
                      >
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        <span className="-ml-3.5 transition-all group-hover:ml-0">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

        </div>

        {/* Kontak Strip + Maps */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2">
            <a
              href={`https://wa.me/${site.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 text-sm text-white/85 transition-colors hover:text-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                <Phone className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] text-white/60">WhatsApp Resmi</span>
                <span className="font-bold">{site.contact.whatsappDisplay}</span>
              </span>
            </a>

            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-3.5 text-sm text-white/85 transition-colors hover:text-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                <Mail className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] text-white/60">Email Informasi</span>
                <span className="font-bold">{site.contact.email}</span>
              </span>
            </a>

            <div className="flex items-center gap-3.5 text-sm text-white/85">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                <Phone className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] text-white/60">Telepon Kantor</span>
                <span className="font-bold">{site.contact.phone}</span>
              </span>
            </div>

            <div className="flex items-center gap-3.5 text-sm text-white/85">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] text-white/60">Jam Layanan</span>
                <span className="font-bold">{site.hours}</span>
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 bg-primary-deep/85 px-5 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light">
                <MapPin className="h-3.5 w-3.5" /> Peta Kampus
              </p>
              <a
                href={site.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-gold hover:text-primary-deep"
              >
                Buka Google Maps ↗
              </a>
            </div>
            <iframe
              title={`Lokasi ${site.name} di Google Maps`}
              src={site.mapsEmbed}
              className="h-full min-h-[220px] w-full grayscale-[25%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-white/60 sm:text-left">
            © {new Date().getFullYear()} {site.name}. Seluruh Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gold-light">
            <span>{site.tagline}</span>
            <Heart className="h-3.5 w-3.5 fill-gold text-gold" />
          </p>
        </div>

      </div>
    </footer>
  )
}
