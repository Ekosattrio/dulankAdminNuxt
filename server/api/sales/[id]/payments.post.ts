import type { SalesPayment } from '#server/types/sales-document'
import { recordSalePaymentDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const body = await readBody<Partial<SalesPayment>>(event)
  const sale = await recordSalePaymentDomain(id, body)
  return createResponse(sale)
})
