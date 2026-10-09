import type { SalesReturn } from '#server/types/sales-return'
export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const records = readSalesData<SalesReturn>('sales-returns.json')
  const remaining = records.filter((item) => item.id !== id)
  if (remaining.length === records.length)
    throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  writeJSON('sales-returns.json', remaining)
  return createResponse({ id })
})
