import type { SalesReturnFormData } from '#server/types/sales-return'

export default defineEventHandler(async (event) =>
  createResponse(await saveSalesReturn(await readBody<SalesReturnFormData>(event)), 'Sales return saved successfully'),
)
