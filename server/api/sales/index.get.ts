import type { Sale } from '~/types/sale'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const status = (query.status as string) || ''
  const channel = (query.channel as string) || ''

  const allSales = await readSalesData<Sale>('sales.json')

  let filtered = allSales

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.saleNo.toLowerCase().includes(search) ||
        item.customer.toLowerCase().includes(search) ||
        item.method.toLowerCase().includes(search),
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((item) => item.status === status)
  }

  if (channel && channel !== 'All') {
    filtered = filtered.filter((item) => item.channel === channel)
  }

  return createResponse(filtered, 'Sales fetched successfully')
})
