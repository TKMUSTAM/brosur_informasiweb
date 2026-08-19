import { useState } from 'react'
import { Check, Copy, MessageCircle, ArrowRight, ShieldCheck, User, Users, FileCheck } from 'lucide-react'
import { Button } from '../Buttons'
import { useCMS } from '../../hooks/useCMS'
import { programs as defaultPrograms } from '../../data/programs'

type FormState = {
  // Calon siswa
  nama: string
  nik: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  alamat: string
  asalSekolah: string
  program: string
  jalur: 'Reguler' | 'Beasiswa Yatim & Dhuafa'
  // Orang tua
  namaAyah: string
  namaIbu: string
  whatsapp: string
  email: string
  alamatOrtu: string
  // Dokumen
  kk: string
  akta: string
}

const empty: FormState = {
  nama: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: 'Laki-laki',
  alamat: '',
  asalSekolah: '',
  program: 'tk-a',
  jalur: 'Reguler',
  namaAyah: '',
  namaIbu: '',
  whatsapp: '',
  email: '',
  alamatOrtu: '',
  kk: '',
  akta: '',
}

export default function PPDBForm() {
  const { data, addPPDBApplicant } = useCMS()
  const site = data.site
  const programs = data.programs.length > 0 ? data.programs : defaultPrograms

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [regNo, setRegNo] = useState<string | null>(null)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!form.nama.trim()) errs.nama = 'Nama lengkap anak wajib diisi'
    if (!form.tanggalLahir) errs.tanggalLahir = 'Tanggal lahir wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!form.namaAyah.trim() && !form.namaIbu.trim()) {
      errs.namaAyah = 'Nama orang tua/wali wajib diisi'
    }
    if (!form.whatsapp.trim()) {
      errs.whatsapp = 'Nomor WhatsApp aktif wajib diisi'
    } else if (form.whatsapp.length < 9) {
      errs.whatsapp = 'Nomor WhatsApp tidak valid'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 400, behavior: 'smooth' })
    } else if (step === 2 && validateStep2()) {
      setStep(3)
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep1() || !validateStep2()) return

    // Generate Nomor Pendaftaran
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    const progCode = form.program.toUpperCase()
    const no = `PPDB-MSTM-${new Date().getFullYear()}-${progCode}-${randomCode}`
    
    // Save to CMS Store
    addPPDBApplicant({
      id: no,
      name: form.nama,
      nik: form.nik,
      birthPlace: form.tempatLahir,
      birthDate: form.tanggalLahir,
      gender: form.jenisKelamin,
      address: form.alamatOrtu || form.alamat,
      previousSchool: form.asalSekolah,
      program: selectedProgramName,
      track: form.jalur,
      parentFather: form.namaAyah,
      parentMother: form.namaIbu,
      whatsapp: form.whatsapp,
      email: form.email,
      status: 'Baru',
    })

    setRegNo(no)
  }

  const selectedProgramName = programs.find((p) => p.slug === form.program)?.name ?? form.program

  // Hasil pendaftaran sukses
  if (regNo) {
    const waText = `Assalamualaikum Admin PPDB TK Islam Al-Mustam,\n\nSaya telah mengisi formulir pendaftaran online:\n- Nomor Registrasi: ${regNo}\n- Nama Calon Siswa: ${form.nama}\n- Pilihan Jenjang: ${selectedProgramName}\n- Jalur: ${form.jalur}\n- Nama Orang Tua: ${form.namaAyah || form.namaIbu}\n- No. WhatsApp: ${form.whatsapp}\n\nMohon informasi verifikasi berkas dan jadwal observasi selanjutnya. Terima kasih.`

    const waUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(waText)}`

    return (
      <div id="daftar-top" className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-white p-8 text-center shadow-lift sm:p-12">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-softgreen shadow-soft">
          <Check className="h-10 w-10 text-primary" strokeWidth={3} />
        </span>

        <div>
          <span className="inline-block rounded-full bg-softgreen px-4 py-1 text-xs font-extrabold text-primary">
            Registrasi Berhasil
          </span>
          <h3 className="mt-2 font-heading text-2xl font-extrabold text-primary sm:text-3xl">
            Alhamdulillah, Data Telah Diterima!
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Terima kasih telah mendaftarkan ananda <strong>{form.nama}</strong> di {site.name}. 
            Berikut adalah nomor registrasi resmi Anda:
          </p>
        </div>

        {/* Nomor Pendaftaran Box */}
        <div className="flex items-center gap-3 rounded-2xl border-2 border-gold/40 bg-softyellow px-6 py-4">
          <span className="font-heading text-xl font-extrabold tracking-wider text-gold-ink sm:text-2xl">{regNo}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(regNo)
              alert('Nomor registrasi berhasil disalin!')
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-soft transition-transform hover:scale-110"
            aria-label="Salin nomor pendaftaran"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        {/* Action WhatsApp Direct Sync */}
        <div className="flex w-full max-w-md flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-lift transition-all duration-300 hover:bg-primary-light hover:shadow-gold"
          >
            <MessageCircle className="h-5 w-5 text-gold" />
            <span>Kirim Format ke WhatsApp Admin PPDB</span>
          </a>
          <p className="text-xs text-ink-mute">
            Klik tombol di atas untuk konfirmasi instan ke admin sekolah.
          </p>
        </div>

        <div className="border-t border-primary/5 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setForm(empty)
              setRegNo(null)
              setStep(1)
            }}
          >
            Daftarkan Calon Siswa Lain
          </Button>
        </div>
      </div>
    )
  }

  const inputCls = (key: string) =>
    `w-full rounded-2xl border-2 bg-cream px-4 py-3.5 text-sm font-medium text-ink outline-none transition-colors focus:border-primary ${
      errors[key] ? 'border-warmred bg-softred/30' : 'border-primary/10 hover:border-primary/30'
    }`

  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft'

  return (
    <form id="daftar-top" onSubmit={submit} className="rounded-3xl border border-primary/10 bg-white p-6 shadow-lift sm:p-10" noValidate>
      
      {/* Progress Steps Header */}
      <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-6">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-cream text-ink-mute'}`}>
            1
          </span>
          <span className="hidden text-xs font-extrabold text-primary sm:inline">Data Siswa</span>
        </div>
        <div className={`h-1 flex-1 mx-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-cream'}`} />
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-cream text-ink-mute'}`}>
            2
          </span>
          <span className="hidden text-xs font-extrabold text-primary sm:inline">Orang Tua</span>
        </div>
        <div className={`h-1 flex-1 mx-3 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-cream'}`} />
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-cream text-ink-mute'}`}>
            3
          </span>
          <span className="hidden text-xs font-extrabold text-primary sm:inline">Jalur &amp; Konfirmasi</span>
        </div>
      </div>

      {/* ===== STEP 1: Data Calon Siswa ===== */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-softgreen text-primary">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-primary">Langkah 1: Identitas Calon Siswa</h2>
              <p className="text-xs text-ink-mute">Masukkan data ananda sesuai akta kelahiran</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nama" className={labelCls}>Nama Lengkap Anak *</label>
              <input id="nama" type="text" value={form.nama} onChange={set('nama')} placeholder="Contoh: Muhammad Rayhan Al-Fatih" className={inputCls('nama')} />
              {errors.nama && <p className="mt-1 text-xs font-semibold text-warmred">{errors.nama}</p>}
            </div>

            <div>
              <label htmlFor="nik" className={labelCls}>NIK Anak (Optional)</label>
              <input id="nik" type="text" inputMode="numeric" maxLength={16} value={form.nik} onChange={set('nik')} placeholder="16 digit sesuai Kartu Keluarga" className={inputCls('nik')} />
            </div>

            <div>
              <label htmlFor="program" className={labelCls}>Pilihan Jenjang Kelas *</label>
              <select id="program" value={form.program} onChange={set('program')} className={inputCls('program')}>
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.code} — {p.name} ({p.age})</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tempat-lahir" className={labelCls}>Tempat Lahir</label>
              <input id="tempat-lahir" type="text" value={form.tempatLahir} onChange={set('tempatLahir')} placeholder="Kota kelahiran" className={inputCls('tempatLahir')} />
            </div>

            <div>
              <label htmlFor="tanggal-lahir" className={labelCls}>Tanggal Lahir *</label>
              <input id="tanggal-lahir" type="date" value={form.tanggalLahir} onChange={set('tanggalLahir')} className={inputCls('tanggalLahir')} />
              {errors.tanggalLahir && <p className="mt-1 text-xs font-semibold text-warmred">{errors.tanggalLahir}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-3">
                {['Laki-laki', 'Perempuan'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, jenisKelamin: g }))}
                    className={`rounded-2xl border-2 py-3 text-sm font-bold transition-all ${
                      form.jenisKelamin === g ? 'border-primary bg-softgreen text-primary' : 'border-primary/10 bg-cream text-ink-soft'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="asal-sekolah" className={labelCls}>Asal Daycare / PAUD Sebelumnya (Bila Ada)</label>
              <input id="asal-sekolah" type="text" value={form.asalSekolah} onChange={set('asalSekolah')} placeholder="Kosongkan jika belum pernah sekolah" className={inputCls('asalSekolah')} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="primary" size="lg" onClick={handleNext} className="gap-2">
              <span>Lanjut ke Data Orang Tua</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 2: Data Orang Tua ===== */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-softgreen text-primary">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-primary">Langkah 2: Data Orang Tua / Wali</h2>
              <p className="text-xs text-ink-mute">Kontak aktif untuk koordinasi observasi dan jadwal sekolah</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nama-ayah" className={labelCls}>Nama Ayah / Wali</label>
              <input id="nama-ayah" type="text" value={form.namaAyah} onChange={set('namaAyah')} placeholder="Nama lengkap ayah" className={inputCls('namaAyah')} />
              {errors.namaAyah && <p className="mt-1 text-xs font-semibold text-warmred">{errors.namaAyah}</p>}
            </div>

            <div>
              <label htmlFor="nama-ibu" className={labelCls}>Nama Ibu</label>
              <input id="nama-ibu" type="text" value={form.namaIbu} onChange={set('namaIbu')} placeholder="Nama lengkap ibu" className={inputCls('namaIbu')} />
            </div>

            <div>
              <label htmlFor="wa-ortu" className={labelCls}>Nomor WhatsApp Aktif *</label>
              <input id="wa-ortu" type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="08xxxxxxxxxx" className={inputCls('whatsapp')} />
              {errors.whatsapp && <p className="mt-1 text-xs font-semibold text-warmred">{errors.whatsapp}</p>}
            </div>

            <div>
              <label htmlFor="email-ortu" className={labelCls}>Alamat Email (Opsional)</label>
              <input id="email-ortu" type="email" value={form.email} onChange={set('email')} placeholder="email@contoh.com" className={inputCls('email')} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="alamat-ortu" className={labelCls}>Alamat Domisili Tempat Tinggal *</label>
              <input id="alamat-ortu" type="text" value={form.alamatOrtu} onChange={set('alamatOrtu')} placeholder="Alamat jalan, kelurahan, kecamatan" className={inputCls('alamatOrtu')} />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" size="lg" onClick={() => setStep(1)}>
              Kembali
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={handleNext} className="gap-2">
              <span>Lanjut ke Konfirmasi</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 3: Jalur & Konfirmasi ===== */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-softgreen text-primary">
              <FileCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-primary">Langkah 3: Pilihan Jalur Pendaftaran</h2>
              <p className="text-xs text-ink-mute">Pilih skema pendaftaran dan periksa ringkasan data</p>
            </div>
          </div>

          {/* Pilihan Jalur */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              onClick={() => setForm((f) => ({ ...f, jalur: 'Reguler' }))}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                form.jalur === 'Reguler' ? 'border-primary bg-softgreen/50 shadow-soft' : 'border-primary/10 bg-cream'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-extrabold text-primary">Jalur Reguler</span>
                <span className={`h-4 w-4 rounded-full border-2 ${form.jalur === 'Reguler' ? 'border-primary bg-primary' : 'border-ink-mute'}`} />
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Pendaftaran umum dengan kemudahan skema cicilan infaq gedung 3x.
              </p>
            </div>

            <div
              onClick={() => setForm((f) => ({ ...f, jalur: 'Beasiswa Yatim & Dhuafa' }))}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                form.jalur === 'Beasiswa Yatim & Dhuafa' ? 'border-warmred bg-softred/40 shadow-soft' : 'border-primary/10 bg-cream'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-extrabold text-warmred">Beasiswa Yatim / Dhuafa</span>
                <span className={`h-4 w-4 rounded-full border-2 ${form.jalur === 'Beasiswa Yatim & Dhuafa' ? 'border-warmred bg-warmred' : 'border-ink-mute'}`} />
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Bebas biaya 100% uang pangkal, SPP, dan seragam bagi anak yatim.
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="rounded-2xl border border-primary/10 bg-cream p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Ringkasan Pendaftaran</h3>
            <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-ink-mute">Calon Siswa:</dt>
                <dd className="font-bold text-ink">{form.nama} ({form.jenisKelamin})</dd>
              </div>
              <div>
                <dt className="text-ink-mute">Jenjang Pilihan:</dt>
                <dd className="font-bold text-primary">{selectedProgramName}</dd>
              </div>
              <div>
                <dt className="text-ink-mute">No. WhatsApp:</dt>
                <dd className="font-bold text-ink">{form.whatsapp}</dd>
              </div>
              <div>
                <dt className="text-ink-mute">Jalur:</dt>
                <dd className="font-bold text-warmred">{form.jalur}</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-mute">
            <ShieldCheck className="h-4 w-4 text-primary-mint" />
            <span>Data ananda terlindungi dan hanya digunakan untuk keperluan pendaftaran resmi yayasan.</span>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" size="lg" onClick={() => setStep(2)}>
              Kembali
            </Button>
            <Button type="submit" variant="primary" size="lg" className="shadow-lift">
              Kirim Formulir Pendaftaran
            </Button>
          </div>
        </div>
      )}

    </form>
  )
}
