import type { RFQItem } from '#server/types/request-quotation'

export default defineEventHandler(async (event) =>
  createResponse(await saveRequestQuotation(await readBody<Partial<RFQItem>>(event)), 'Request quotation saved successfully'),
)
