import type { SaleFormData } from '~/types/sale'
import { saveSale } from '#server/utils/sales'

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event)
  const result = saveSale(body)
  return createResponse(result.sale, result.message)
})
