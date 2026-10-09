import type { QuotationFormData } from '#server/types/quotation'
import { saveQuotationDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<QuotationFormData>(event)
  const { quotation, isNew } = await saveQuotationDomain(body)
  return createResponse(quotation, isNew ? 'Quotation created successfully' : 'Quotation updated successfully')
})
