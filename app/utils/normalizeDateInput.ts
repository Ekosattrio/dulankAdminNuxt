/** Converts API dates and legacy DD/MM/YYYY fields for native date inputs. */
export function normalizeDateInput(value?: string | null): string {
  if (!value) return ''
  const iso = value.match(/^(\d{4}-\d{2}-\d{2})(?:[T ]|$)/)
  if (iso) return iso[1]!
  const legacy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return legacy ? `${legacy[3]}-${legacy[2]}-${legacy[1]}` : ''
}
