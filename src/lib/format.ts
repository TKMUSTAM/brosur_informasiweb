/** Format angka menjadi Rupiah, mis. 2500000 -> Rp 2.500.000 */
export function formatRupiah(value: number): string {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

/** Format angka ringkas, mis. 487500000 -> Rp 487,5 jt */
export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} M`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')} jt`
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} rb`
  }
  return formatRupiah(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}
