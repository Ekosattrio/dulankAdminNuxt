/**
 * Format number as Indonesian Rupiah (e.g. Rp900.000 or Rp.899,500 based on options)
 */
export const formatRupiah = (value: number | string | null | undefined, withPrefix = true, useDot = true): string => {
  if (value === null || value === undefined || value === '') return withPrefix ? 'Rp0' : '0'
  const cleanNum = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
  
  // Formatting with dot thousand separator
  if (useDot) {
    const parts = Math.round(cleanNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return withPrefix ? `Rp${parts}` : parts
  } else {
    // Formatting with comma thousand separator (used in sales-note.html e.g. Rp.899,500)
    const parts = Math.round(cleanNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return withPrefix ? `Rp.${parts}` : parts
  }
}

/**
 * Format standard number with thousand separator
 */
export const formatNumber = (value: number | string | null | undefined): string => {
  return formatRupiah(value, false, true)
}

/**
 * Parse numeric string back to number
 */
export const parseNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const cleaned = String(value).replace(/\./g, '').replace(/,/g, '.')
  return parseFloat(cleaned) || 0
}

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return String(dateInput)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format date to DD MMM YYYY (e.g. 02 Jan 2025)
 */
export const formatDateMedium = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return String(dateInput)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export const useFormatters = () => {
  return {
    formatRupiah,
    formatNumber,
    parseNumber,
    formatDate,
    formatDateMedium
  }
}

