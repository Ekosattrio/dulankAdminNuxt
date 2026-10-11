import type { PaymentFilterParams } from '#server/types/payment'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const filters: PaymentFilterParams = {
    search: (query.search as string) || '',
    date: (query.date as string) || '',
    startDate: (query.startDate as string) || '',
    endDate: (query.endDate as string) || '',
    type: (query.type as string) || '',
    method: (query.method as string) || '',
  }
  return createResponse(listPayments(filters), 'Payments fetched successfully')
})
