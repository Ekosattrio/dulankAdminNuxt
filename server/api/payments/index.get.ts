import type { PaymentRecord } from '#server/types/payment'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const date = ((query.date as string) || '').toLowerCase().trim()
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''
  const type = (query.type as string) || ''
  const method = (query.method as string) || ''

  let records = readPaymentData<PaymentRecord>('payments.json')

  if (search) {
    records = records.filter(
      (item) =>
        item.refNo.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.created.toLowerCase().includes(search),
    )
  }

  if (date) records = records.filter((item) => item.date.toLowerCase().includes(date))
  if (startDate || endDate) records = records.filter((item) => isDateWithinRange(item.date, startDate, endDate))
  if (type) records = records.filter((item) => item.type === type)
  if (method) records = records.filter((item) => item.method === method)

  return createResponse(records, 'Payments fetched successfully')
})
