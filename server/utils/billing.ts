import type { BillingQuery, BillingStore } from '#server/types/billing'
import { isDateWithinRange } from './dateRange'

export function listBillings(query: BillingQuery) {
  const store = readJSON<BillingStore>('billing.json')
  if (!store?.summary || !Array.isArray(store.records) || Object.values(store.summary).some(value => !Number.isFinite(value))) {
    throw createError({ statusCode: 500, statusMessage: 'Billing data is invalid' })
  }
  if (store.records.some(item => !item.id || !item.transactionId || !item.userId || !item.billingId || !item.transactionNo || !item.userEmail || !item.billingDate || !item.createdAt || !item.updatedAt || [item.subtotal, item.discount, item.tax, item.shipping, item.total].some(value => !Number.isFinite(value)))) {
    throw createError({ statusCode: 500, statusMessage: 'Billing record is invalid' })
  }
  const search = query.search?.trim().toLowerCase()
  const records = store.records.filter(item =>
    (!search || [item.billingId, item.transactionNo, item.userEmail].some(value => value.toLowerCase().includes(search)))
    && (!query.paymentMethod || item.paymentMethod === query.paymentMethod)
    && (!query.status || item.status === query.status)
    && (!(query.startDate || query.endDate) || isDateWithinRange(item.billingDate, query.startDate, query.endDate)),
  )
  return { data: records, summary: store.summary }
}
