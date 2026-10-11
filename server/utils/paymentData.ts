import type { PaymentFilterParams, PaymentRecord } from '#server/types/payment'
import { isDateWithinRange } from './dateRange'
import { readJSON } from './data'

export function listPayments(filters: PaymentFilterParams = {}): PaymentRecord[] {
  const search = filters.search?.toLowerCase().trim() || ''
  const date = filters.date?.toLowerCase().trim() || ''
  let records = readJSON<PaymentRecord[]>('payments.json')

  if (!Array.isArray(records)) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to read payments.json; expected an array' })
  }
  if (search) {
    records = records.filter((item) =>
      [item.refNo, item.name, item.created].some((value) => value.toLowerCase().includes(search)),
    )
  }
  if (date) records = records.filter((item) => item.date.toLowerCase().includes(date))
  if (filters.startDate || filters.endDate) {
    records = records.filter((item) => isDateWithinRange(item.date, filters.startDate || '', filters.endDate || ''))
  }
  if (filters.type) records = records.filter((item) => item.type === filters.type)
  if (filters.method) records = records.filter((item) => item.method === filters.method)
  return records
}
