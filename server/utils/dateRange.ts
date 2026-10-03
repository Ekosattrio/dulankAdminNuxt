interface DateParts {
  year: number
  month: number
  day: number
}

function parseDateParts(value?: string | null): DateParts | null {
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

function toDateTime(value?: string | null) {
  const parts = parseDateParts(value)
  if (!parts) return null
  return new Date(parts.year, parts.month - 1, parts.day).getTime()
}

export function isDateWithinRange(value: string, startDate?: string | null, endDate?: string | null) {
  const dateTime = toDateTime(value)
  const startTime = toDateTime(startDate)
  const endTime = toDateTime(endDate)

  if (dateTime === null) return false
  if (startTime !== null && dateTime < startTime) return false
  if (endTime !== null && dateTime > endTime) return false
  return true
}
