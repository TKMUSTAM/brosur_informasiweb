import { useState } from 'react'
import { Check, Copy, MessageCircle, ArrowRight, ShieldCheck, User, Users, FileCheck } from 'lucide-react'
import { Button } from '../Buttons'
import { useCMS } from '../../hooks/useCMS'
import { programs as defaultPrograms } from '../../data/programs'
import { submitPpdbDocument, submitPpdbRegistration, type PpdbDocumentType } from '../../lib/ppdbApi'

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
  nomorKk: string
  nikAyah: string
  pekerjaanAyah: string
  pendidikanAyah: string
  nikIbu: string
  pekerjaanIbu: string
  pendidikanIbu: string
  anakKe: string
  jumlahSaudara: string
  golonganDarah: string
  catatanMedis: string
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
  nomorKk: '',
  nikAyah: '',
  pekerjaanAyah: '',
  pendidikanAyah: '',
  nikIbu: '',
  pekerjaanIbu: '',
  pendidikanIbu: '',
  anakKe: '',
  jumlahSaudara: '',
  golonganDarah: '',
  catatanMedis: '',
}

const DOCUMENT_FIELDS: Array<{ type: PpdbDocumentType; label: string; required: boolean }> = [
  { type: 'KARTU_KELUARGA', label: 'Kartu Keluarga', required: true },
  { type: 'AKTA_KELAHIRAN', label: 'Akta kelahiran anak', required: true },
  { type: 'KTP_ORANG_TUA', label: 'KTP orang tua atau wali', required: false },
  { type: 'PAS_FOTO', label: 'Pas foto anak', required: false },
]

export default function PPDBForm() {
  const { data } = useCMS()
  const site = data.site
  const programs = data.programs.length > 0 ? data.programs : defaultPrograms
  const ppdb = data.pageContent.ppdb

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [regNo, setRegNo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [documents, setDocuments] = useState<Partial<Record<PpdbDocumentType, File>>>({})

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
    if (!form.alamatOrtu.trim()) errs.alamatOrtu = 'Alamat domisili wajib diisi'
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !validateStep1() || !validateStep2()) return
    if (!documents.KARTU_KELUARGA || !documents.AKTA_KELAHIRAN) {
      setSubmitError('Kartu Keluarga dan akta kelahiran wajib diunggah sebelum formulir dikirim.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitPpdbRegistration({
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
        guardianAddress: form.alamatOrtu,
        familyCardNumber: form.nomorKk,
        fatherNik: form.nikAyah,
        fatherOccupation: form.pekerjaanAyah,
        fatherEducation: form.pendidikanAyah,
        motherNik: form.nikIbu,
        motherOccupation: form.pekerjaanIbu,
        motherEducation: form.pendidikanIbu,
        childOrder: form.anakKe,
        siblingCount: form.jumlahSaudara,
        bloodType: form.golonganDarah,
        medicalNotes: form.catatanMedis,
      })
      for (const { type } of DOCUMENT_FIELDS) {
        const file = documents[type]
        if (file) await submitPpdbDocument(result.applicationNumber, form.whatsapp, type, file)
      }
      setRegNo(result.applicationNumber)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Pendaftaran belum dapat dikirim.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProgramName = programs.find((p) => p.slug === form.program)?.name ?? form.program

  if (!ppdb.registrationOpen) {
    return <div className="rounded-3xl border border-primary/10 bg-white p-8 text-center shadow-soft sm:p-12"><h2 className="font-heading text-2xl font-extrabold text-primary">Pendaftaran belum dibuka</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">{ppdb.notice}</p><a href={`https://wa.me/${site.contact.whatsapp}`} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-white">Hubungi admin PPDB</a></div>
  }

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
              setDocuments({})
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
                  <option key={p.slug} value={p.slug}>{p.code}: {p.name} ({p.age})</option>
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
              {errors.alamatOrtu && <p className="mt-1 text-xs font-semibold text-warmred">{errors.alamatOrtu}</p>}
            </div>
            <div>
              <label htmlFor="nomor-kk" className={labelCls}>Nomor Kartu Keluarga</label>
              <input id="nomor-kk" inputMode="numeric" maxLength={16} value={form.nomorKk} onChange={set('nomorKk')} className={inputCls('nomorKk')} />
            </div>
            <div>
              <label htmlFor="anak-ke" className={labelCls}>Anak ke</label>
              <input id="anak-ke" type="number" min="1" value={form.anakKe} onChange={set('anakKe')} className={inputCls('anakKe')} />
            </div>
            <div>
              <label htmlFor="nik-ayah" className={labelCls}>NIK Ayah / Wali</label>
              <input id="nik-ayah" inputMode="numeric" maxLength={16} value={form.nikAyah} onChange={set('nikAyah')} className={inputCls('nikAyah')} />
            </div>
            <div>
              <label htmlFor="pekerjaan-ayah" className={labelCls}>Pekerjaan Ayah / Wali</label>
              <input id="pekerjaan-ayah" value={form.pekerjaanAyah} onChange={set('pekerjaanAyah')} className={inputCls('pekerjaanAyah')} />
            </div>
            <div>
              <label htmlFor="pendidikan-ayah" className={labelCls}>Pendidikan terakhir Ayah</label>
              <input id="pendidikan-ayah" value={form.pendidikanAyah} onChange={set('pendidikanAyah')} className={inputCls('pendidikanAyah')} />
            </div>
            <div>
              <label htmlFor="nik-ibu" className={labelCls}>NIK Ibu</label>
              <input id="nik-ibu" inputMode="numeric" maxLength={16} value={form.nikIbu} onChange={set('nikIbu')} className={inputCls('nikIbu')} />
            </div>
            <div>
              <label htmlFor="pekerjaan-ibu" className={labelCls}>Pekerjaan Ibu</label>
              <input id="pekerjaan-ibu" value={form.pekerjaanIbu} onChange={set('pekerjaanIbu')} className={inputCls('pekerjaanIbu')} />
            </div>
            <div>
              <label htmlFor="pendidikan-ibu" className={labelCls}>Pendidikan terakhir Ibu</label>
              <input id="pendidikan-ibu" value={form.pendidikanIbu} onChange={set('pendidikanIbu')} className={inputCls('pendidikanIbu')} />
            </div>
            <div>
              <label htmlFor="jumlah-saudara" className={labelCls}>Jumlah saudara kandung</label>
              <input id="jumlah-saudara" type="number" min="0" value={form.jumlahSaudara} onChange={set('jumlahSaudara')} className={inputCls('jumlahSaudara')} />
            </div>
            <div>
              <label htmlFor="golongan-darah" className={labelCls}>Golongan darah</label>
              <select id="golongan-darah" value={form.golonganDarah} onChange={set('golonganDarah')} className={inputCls('golonganDarah')}>
                <option value="">Belum diketahui</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="catatan-medis" className={labelCls}>Alergi atau catatan kesehatan</label>
              <input id="catatan-medis" value={form.catatanMedis} onChange={set('catatanMedis')} placeholder="Kosongkan bila tidak ada" className={inputCls('catatanMedis')} />
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
                Pendaftaran umum sesuai ketentuan dan periode PPDB yang sedang berlaku.
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
                Cakupan bantuan ditentukan setelah dokumen pendaftar diverifikasi oleh sekretariat.
              </p>
            </div>
          </div>

          <fieldset className="rounded-2xl border border-primary/15 bg-cream p-5">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-primary">Berkas pendaftaran</legend>
            <p className="mb-4 text-xs leading-5 text-ink-soft">Unggah PDF, JPG, PNG, atau WebP. Ukuran maksimal 5 MB per berkas.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {DOCUMENT_FIELDS.map((document) => (
                <label key={document.type} className="block text-xs font-bold text-ink-soft">
                  {document.label}{document.required ? ' *' : ' (opsional)'}
                  <input
                    type="file"
                    required={document.required}
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      setDocuments((current) => ({ ...current, [document.type]: file }))
                      setSubmitError(null)
                    }}
                    className="mt-2 block min-h-12 w-full rounded-xl border border-primary/15 bg-white p-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:font-bold file:text-white"
                  />
                </label>
              ))}
            </div>
          </fieldset>

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
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan Pendaftaran...' : 'Kirim Formulir Pendaftaran'}
            </Button>
          </div>
          {submitError && (
            <p role="alert" className="rounded-2xl border border-warmred/30 bg-softred/40 px-4 py-3 text-sm font-semibold text-warmred">
              {submitError}
            </p>
          )}
        </div>
      )}

    </form>
  )
}
