import type { Quotation } from '~/types/quotation'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allQuotations = await readJSON<Quotation[]>('quotations.json', [])

  let filtered = allQuotations

  if (search) {
    filtered = filtered.filter(item =>
      item.noQuotation.toLowerCase().includes(search) ||
      item.customer.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Quotations fetched successfully')
})

