/**
 * Garis aksen emas dekoratif — pengganti badge di atas heading.
 * Murni visual (aria-hidden), dipakai di Hero & WelcomeSection.
 */
export default function GoldAccent() {
  return (
    <span aria-hidden="true" className="flex items-center gap-2">
      <span className="h-[3px] w-10 rounded-none bg-gradient-to-r from-gold to-gold-light" />
      <span className="h-[3px] w-3 rounded-none bg-gold/40" />
    </span>
  )
}
