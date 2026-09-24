import type { Invoice } from '~/types/invoice'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invoice ID is required'
    })
  }

  const allInvoices = await readJSON<Invoice[]>('invoices.json', [])
  const newInvoices = allInvoices.filter(i => i.id !== id && i.invoiceNo !== id)

  if (allInvoices.length === newInvoices.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found'
    })
  }

  await writeJSON('invoices.json', newInvoices)

  return createResponse({ id }, 'Invoice deleted successfully')
})

