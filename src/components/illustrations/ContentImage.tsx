import Scene, { type PaletteKey } from './Scene'

type ContentImageProps = {
  image?: string
  scene: string
  palette: PaletteKey
  className?: string
  alt?: string
}

/**
 * Merender foto konten (`image`) bila tersedia, dengan fallback ke
 * ilustrasi Scene bila field image kosong. Foto diberi loading="lazy"
 * dan object-cover agar konsisten di dalam kartu berukuran tetap.
 */
export default function ContentImage({ image, scene, palette, className, alt }: ContentImageProps) {
  if (image) {
    return <img src={image} alt={alt ?? ''} loading="lazy" className={`object-cover ${className ?? ''}`} />
  }
  return <Scene scene={scene as never} palette={palette} className={className} />
}
