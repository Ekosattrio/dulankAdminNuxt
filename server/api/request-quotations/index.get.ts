import type { RFQItem } from '#server/types/request-quotation'

export default defineEventHandler(() => createResponse(readSalesData<RFQItem>('request-quotations.json')))
