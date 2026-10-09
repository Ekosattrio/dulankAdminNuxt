import type { RFQItem } from '#server/types/request-quotation'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const records = readSalesData<RFQItem>('request-quotations.json')
  const remaining = records.filter((item) => item.id !== id)
  if (remaining.length === records.length)
    throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  writeJSON('request-quotations.json', remaining)
  return createResponse({ id })
})
