/**
 * Utility Formatting & Parsing Mata Uang / Separator Ribuan (IDR / Currency)
 * Standar reusable untuk seluruh aplikasi Dulank Admin
 */

export interface FormatMoneyOptions {
  /** Prefix mata uang, contoh: 'Rp', 'Rp ', atau '' (default: '') */
  prefix?: string
  /** Suffix mata uang, contoh: ',-' */
  suffix?: string
  /** Jumlah desimal (default: 0) */
  decimalPlaces?: number
  /** Nilai pengganti jika null / undefined / NaN (default: '0') */
  fallback?: string
  /** Pemisah ribuan: koma (,) atau titik (.) (default: '.') */
  thousandSeparator?: ',' | '.'
}

/**
 * Format angka atau string angka ke format ribuan (cth: 50,000 atau 50.000)
 */
export function formatMoney(
  value: number | string | null | undefined,
  options: FormatMoneyOptions = {}
): string {
  const {
    prefix = '',
    suffix = '',
    decimalPlaces = 0,
    fallback = '0',
    thousandSeparator = '.'
  } = options

  if (value === null || value === undefined || value === '') {
    return prefix ? `${prefix}${fallback}${suffix}` : `${fallback}${suffix}`
  }

  // Jika string dengan titik/koma ribuan lama, parse dulu
  const num = typeof value === 'number' ? value : parseMoney(value)

  if (Number.isNaN(num)) {
    return prefix ? `${prefix}${fallback}${suffix}` : `${fallback}${suffix}`
  }

  const isNegative = num < 0
  const absNum = Math.abs(num)

  // Format integer part dengan separator yang dipilih (default titik '.')
  const parts = absNum.toFixed(decimalPlaces).split('.')
  const integerPart = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
  const decimalPart = parts[1] ? (thousandSeparator === '.' ? `,${parts[1]}` : `.${parts[1]}`) : ''

  const formatted = `${isNegative ? '-' : ''}${integerPart}${decimalPart}`

  return prefix ? `${prefix}${formatted}${suffix}` : `${formatted}${suffix}`
}

/**
 * Format nilai ke Rupiah standar (cth: "Rp 10.000" atau "Rp10.000")
 */
export function formatIDR(
  value: number | string | null | undefined,
  withSpace = true,
  fallback = '0',
  thousandSeparator: ',' | '.' = '.'
): string {
  const prefix = withSpace ? 'Rp ' : 'Rp'
  return formatMoney(value, { prefix, fallback, thousandSeparator })
}

/**
 * Parse string uang / format separator ribuan kembali menjadi number murni
 * Contoh: "Rp 1,500,000" -> 1500000, "50,000" -> 50000, "10.000" -> 10000
 */
export function parseMoney(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return Number.isNaN(value) ? 0 : value

  const str = String(value).trim()
  if (!str) return 0

  // Tangani tanda minus
  const isNegative = str.startsWith('-') || str.includes('(-')

  // Buang semua karakter selain angka
  const clean = str.replace(/[^\d]/g, '')
  if (!clean) return 0

  const num = parseInt(clean, 10)
  if (Number.isNaN(num)) return 0

  return isNegative ? -Math.abs(num) : Math.abs(num)
}

/**
 * Helper class Tailwind untuk alignment / justification teks uang
 * @param align 'left' (justify-start) atau 'right' (justify-end) atau 'center'
 */
export function currencyAlignClass(align: 'left' | 'right' | 'center' = 'right'): string {
  if (align === 'left') {
    return 'text-left justify-start font-mono tabular-nums'
  }
  if (align === 'center') {
    return 'text-center justify-center font-mono tabular-nums'
  }
  return 'text-right justify-end font-mono tabular-nums'
}
