import type { Invoice } from '~/types/invoice'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allInvoices = await readJSON<Invoice[]>('invoices.json', [])

  let filtered = allInvoices

  if (search) {
    filtered = filtered.filter(item =>
      item.invoiceNo.toLowerCase().includes(search) ||
      item.customer.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Invoices fetched successfully')
})

