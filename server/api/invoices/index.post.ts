import type { InvoiceFormData } from '#server/types/invoice'

export default defineEventHandler(async (event) =>
  createResponse(await saveInvoice(await readBody<InvoiceFormData>(event)), 'Invoice saved successfully'),
)
