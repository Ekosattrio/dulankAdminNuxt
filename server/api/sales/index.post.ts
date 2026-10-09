import type { SaleFormData } from '#server/types/sale'
import { saveSaleDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event)
  const { sale, isNew } = await saveSaleDomain(body)
  return createResponse(sale, isNew ? 'Sale created successfully' : 'Sale updated successfully')
})
