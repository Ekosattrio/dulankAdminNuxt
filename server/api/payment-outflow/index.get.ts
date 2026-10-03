import type { PaymentBalanceEntry, PaymentFlowRecord } from '#server/types/payment-flow'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const date = ((query.date as string) || '').toLowerCase().trim()
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''
  const source = (query.source as string) || ''
  const status = (query.status as string) || ''
  let records = readPaymentFlowData<PaymentFlowRecord>('payment-outflows.json')

  if (search) {
    records = records.filter((item) =>
      [item.refNo, item.name, item.source, item.note].some((value) => value?.toLowerCase().includes(search)),
    )
  }
  if (date) records = records.filter((item) => item.date.toLowerCase().includes(date))
  if (startDate || endDate) records = records.filter((item) => isDateWithinRange(item.date, startDate, endDate))
  if (source) records = records.filter((item) => item.source === source)
  if (status) records = records.filter((item) => item.status === status)

  return createResponse(records, {
    balances: readPaymentFlowData<PaymentBalanceEntry>('payment-balances.json'),
  })
})
