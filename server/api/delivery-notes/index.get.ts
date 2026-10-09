import type { DeliveryNote } from '~/types/delivery-note'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const status = (query.status as string) || ''

  const allNotes = await readSalesData<DeliveryNote>('delivery-notes.json')

  let filtered = allNotes

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.dnNo.toLowerCase().includes(search) ||
        item.customer.toLowerCase().includes(search) ||
        item.noSales.toLowerCase().includes(search) ||
        item.shippingAddress.toLowerCase().includes(search),
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((item) => item.status === status)
  }

  return createResponse(filtered, 'Delivery notes fetched successfully')
})
