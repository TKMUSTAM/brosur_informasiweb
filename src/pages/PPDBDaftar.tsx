import { Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PPDBForm from '../components/forms/PPDBForm'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import { useCMS } from '../hooks/useCMS'

export default function PPDBDaftar() {
  const { data } = useCMS()
  const ppdb = data.pageContent.ppdb
  useSEO({
    title: 'Formulir Pendaftaran PPDB',
    description: `Isi formulir pendaftaran online PPDB ${ppdb.academicYear} untuk TPA, KB, TK A, dan TK B.`,
    path: '/ppdb/daftar',
  })

  return (
    <>
      <PageHeader
        eyebrow={`PPDB ${ppdb.academicYear}`}
        title="Formulir Pendaftaran Online"
        description={ppdb.registrationOpen ? 'Lengkapi data berikut dengan benar untuk memulai proses pendaftaran.' : 'Formulir sedang ditutup. Hubungi admin untuk informasi gelombang berikutnya.'}
        crumbs={[{ label: 'PPDB', href: '/ppdb' }, { label: 'Formulir Pendaftaran' }]}
      />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8 flex items-start gap-3 rounded-xl bg-softblue p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <p className="text-sm leading-relaxed text-secondary-dark">
              Setelah mengirim formulir, Anda akan menerima <strong>nomor pendaftaran</strong>. Simpan nomor
              tersebut untuk memantau status pendaftaran melalui WhatsApp resmi yayasan. {ppdb.notice}
            </p>
          </Reveal>

          <Reveal>
            <PPDBForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
