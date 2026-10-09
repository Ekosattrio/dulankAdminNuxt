export type DateRangePreset = 'yesterday' | 'last7Days' | 'thisMonth' | 'lastMonth' | 'lastYear' | 'custom'

export interface DateRangeValue {
  start: string
  end: string
  preset?: DateRangePreset
  label?: string
}

interface DateParts {
  year: number
  month: number
  day: number
}

export const dateRangePresetOptions: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'yesterday', label: 'Kemarin' },
  { value: 'last7Days', label: '7 Hari Terakhir' },
  { value: 'thisMonth', label: 'Bulan Ini' },
  { value: 'lastMonth', label: 'Bulan Lalu' },
  { value: 'lastYear', label: 'Tahun Lalu' },
  { value: 'custom', label: 'Rentang Kustom' },
]

function padDatePart(value: number) {
  return String(value).padStart(2, '0')
}

function fromLocalDate(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

function toLocalDate(parts: DateParts) {
  return new Date(parts.year, parts.month - 1, parts.day)
}

export function parseDateParts(value?: string | null): DateParts | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    return {
      year: Number(isoMatch[1]),
      month: Number(isoMatch[2]),
      day: Number(isoMatch[3]),
    }
  }

  const legacyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (legacyMatch) {
    return {
      year: Number(legacyMatch[3]),
      month: Number(legacyMatch[2]),
      day: Number(legacyMatch[1]),
    }
  }

  return null
}

export function toISODate(value?: string | Date | null) {
  if (!value) return ''
  const parts = value instanceof Date ? fromLocalDate(value) : parseDateParts(value)
  if (!parts) return ''
  return `${parts.year}-${padDatePart(parts.month)}-${padDatePart(parts.day)}`
}

export function formatLegacyDate(value?: string | Date | null) {
  if (!value) return ''
  const parts = value instanceof Date ? fromLocalDate(value) : parseDateParts(value)
  if (!parts) return ''
  return `${padDatePart(parts.day)}/${padDatePart(parts.month)}/${parts.year}`
}

export function compareDateInput(a?: string | null, b?: string | null) {
  const first = parseDateParts(a)
  const second = parseDateParts(b)
  if (!first || !second) return 0
  return toLocalDate(first).getTime() - toLocalDate(second).getTime()
}

export function normalizeDateRange(range?: DateRangeValue | null): DateRangeValue | null {
  if (!range?.start && !range?.end) return null
  const start = toISODate(range?.start || range?.end)
  const end = toISODate(range?.end || range?.start)
  if (!start || !end) return null

  return compareDateInput(start, end) <= 0
    ? { ...range, start, end }
    : { ...range, start: end, end: start }
}

export function dateRangeToDisplay(range?: DateRangeValue | null, placeholder = 'Date') {
  const normalized = normalizeDateRange(range)
  if (!normalized) return placeholder

  const start = formatLegacyDate(normalized.start)
  const end = formatLegacyDate(normalized.end)
  return start === end ? start : `${start} - ${end}`
}

export function createPresetDateRange(preset: DateRangePreset, baseDate = new Date()): DateRangeValue | null {
  if (preset === 'custom') return null

  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
  let start = new Date(today)
  let end = new Date(today)

  if (preset === 'yesterday') {
    start.setDate(today.getDate() - 1)
    end = new Date(start)
  }

  if (preset === 'last7Days') {
    start.setDate(today.getDate() - 6)
  }

  if (preset === 'thisMonth') {
    start = new Date(today.getFullYear(), today.getMonth(), 1)
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  }

  if (preset === 'lastMonth') {
    start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    end = new Date(today.getFullYear(), today.getMonth(), 0)
  }

  if (preset === 'lastYear') {
    start = new Date(today.getFullYear() - 1, 0, 1)
    end = new Date(today.getFullYear() - 1, 11, 31)
  }

  const option = dateRangePresetOptions.find((item) => item.value === preset)
  return {
    start: toISODate(start),
    end: toISODate(end),
    preset,
    label: option?.label,
  }
}

export function isDateInRange(value: string, range?: DateRangeValue | null) {
  const normalized = normalizeDateRange(range)
  const date = toISODate(value)
  if (!normalized || !date) return true
  return compareDateInput(date, normalized.start) >= 0 && compareDateInput(date, normalized.end) <= 0
}

export function useDateRange(initialValue: DateRangeValue | null = null) {
  const range = ref<DateRangeValue | null>(normalizeDateRange(initialValue))
  const displayValue = computed(() => dateRangeToDisplay(range.value))

  function setPreset(preset: DateRangePreset) {
    range.value = createPresetDateRange(preset)
  }

  function setCustom(start: string, end: string) {
    range.value = normalizeDateRange({ start, end, preset: 'custom', label: 'Rentang Kustom' })
  }

  function clear() {
    range.value = null
  }

  return {
    range,
    displayValue,
    setPreset,
    setCustom,
    clear,
  }
}
