import type { InvoiceFormData } from '#server/types/invoice'
import { saveInvoiceDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<InvoiceFormData>(event)
  const { invoice, isNew } = await saveInvoiceDomain(body)
  return createResponse(invoice, isNew ? 'Invoice created successfully' : 'Invoice updated successfully')
})
