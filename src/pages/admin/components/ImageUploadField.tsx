import { useId, useRef, useState } from 'react'
import { ImagePlus, Link2, Trash2, Upload } from 'lucide-react'

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  altValue?: string
  onAltChange?: (value: string) => void
  recommended?: string
  required?: boolean
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_EDGE = 1600

export default function ImageUploadField({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  recommended = 'JPG, PNG, atau WebP. Maksimal 5 MB.',
  required = false,
}: ImageUploadFieldProps) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    setPreviewFailed(false)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file melebihi 5 MB. Kompres gambar lalu coba lagi.')
      return
    }

    setProcessing(true)
    try {
      const optimized = await optimizeImage(file)
      onChange(optimized)
    } catch {
      setError('Gambar gagal diproses. Coba file lain atau gunakan URL gambar.')
    } finally {
      setProcessing(false)
    }
  }

  const handleUrl = (nextValue: string) => {
    setError('')
    setPreviewFailed(false)
    onChange(nextValue.trimStart())
  }

  return (
    <fieldset className="space-y-3 rounded-2xl border border-primary/10 bg-cream/30 p-4">
      <legend className="px-1 text-xs font-bold text-ink">{label}</legend>

      <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-white">
          {value && !previewFailed ? (
            <img src={value} alt={altValue || 'Pratinjau gambar'} className="h-full w-full object-cover" onError={() => setPreviewFailed(true)} />
          ) : (
            <div className="px-3 text-center text-ink-mute"><ImagePlus className="mx-auto h-7 w-7" /><p className="mt-2 text-[11px]">{previewFailed ? 'Gambar tidak dapat dimuat' : 'Belum ada gambar'}</p></div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} id={inputId} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleFile} className="sr-only" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={processing} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              <Upload className="h-4 w-4" /> {processing ? 'Memproses...' : value ? 'Ganti file' : 'Upload gambar'}
            </button>
            {value && <button type="button" onClick={() => { onChange(''); setPreviewFailed(false) }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-warmred/25 bg-white px-4 text-xs font-bold text-warmred focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warmred"><Trash2 className="h-4 w-4" />Hapus</button>}
          </div>
          <p className="text-[11px] leading-relaxed text-ink-mute">{recommended} File dioptimalkan otomatis sebelum disimpan.</p>
        </div>
      </div>

      <label>
        <span className="mb-1.5 flex items-center gap-2 text-xs font-bold text-ink"><Link2 className="h-3.5 w-3.5" />Atau tempel URL gambar online</span>
        <input type="text" inputMode="url" required={required && !value} value={value.startsWith('data:') ? '' : value} onChange={(event) => handleUrl(event.target.value)} placeholder="https://cdn.contoh.id/foto.webp atau /images/foto.webp" className="min-h-11 w-full rounded-xl border border-primary/15 bg-white px-4 text-sm text-ink outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15" />
      </label>

      {value.startsWith('data:') && <p className="text-[11px] font-semibold text-primary">Sumber aktif: file hasil upload</p>}

      {onAltChange && (
        <label>
          <span className="mb-1.5 block text-xs font-bold text-ink">Deskripsi gambar untuk aksesibilitas</span>
          <input type="text" value={altValue || ''} onChange={(event) => onAltChange(event.target.value)} placeholder="Contoh: Anak-anak belajar membaca Al-Qur'an bersama guru" className="min-h-11 w-full rounded-xl border border-primary/15 bg-white px-4 text-sm text-ink outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15" />
        </label>
      )}

      {error && <p role="alert" className="text-xs font-semibold text-warmred">{error}</p>}
    </fieldset>
  )
}

async function optimizeImage(file: File): Promise<string> {
  const source = await readAsDataUrl(file)
  const image = await loadImage(source)
  const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas tidak tersedia')
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/webp', 0.82)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })
}
