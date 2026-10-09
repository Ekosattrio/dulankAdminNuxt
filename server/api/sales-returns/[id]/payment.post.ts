import type { ReturnPayment } from '#server/types/sales-return'
import { recordSalesReturnPaymentDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<ReturnPayment>(event)
  const record = await recordSalesReturnPaymentDomain(id, body)
  return createResponse(record)
})
