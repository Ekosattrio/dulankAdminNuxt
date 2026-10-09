import type { RFQItem } from '#server/types/request-quotation'
import { saveRequestQuotationDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<RFQItem>>(event)
  const { rfq } = await saveRequestQuotationDomain(body)
  return createResponse(rfq)
})
