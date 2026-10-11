import type { QuotationFormData } from '#server/types/quotation'

export default defineEventHandler(async (event) =>
  createResponse(await saveQuotation(await readBody<QuotationFormData>(event)), 'Quotation saved successfully'),
)
