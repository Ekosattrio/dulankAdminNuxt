import type { SalesReturnFormData } from '#server/types/sales-return'
import { saveSalesReturnDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<SalesReturnFormData>(event)
  const { salesReturn } = await saveSalesReturnDomain(body)
  return createResponse(salesReturn)
})
