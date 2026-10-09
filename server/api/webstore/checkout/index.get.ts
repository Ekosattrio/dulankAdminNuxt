import type { CheckoutItem, CheckoutStats } from '~/types/checkout'
import { isDateWithinRange } from '#server/utils/dateRange'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<CheckoutItem[]>('checkouts.json', [])

  const totalCheckout = items.length
  const totalRevenue = items
    .filter(i => i.status === 'Berhasil')
    .reduce((sum, item) => sum + (Number(item.payment) || 0), 0)
  const totalSuccess = items.filter(i => i.status === 'Berhasil').length
  const totalFailed = items.filter(i => i.status === 'Gagal').length

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.voucher && item.voucher.toLowerCase().includes(s)) ||
      (item.detailProduct && item.detailProduct.toLowerCase().includes(s)) ||
      (item.method && item.method.toLowerCase().includes(s))
    )
  }

  if (query.method && query.method !== 'All' && query.method !== 'All Metode') {
    filtered = filtered.filter(item => item.method.toLowerCase() === String(query.method).toLowerCase())
  }

  if (query.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.dateCheckout, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
    stats: {
      totalCheckout,
      totalRevenue,
      totalSuccess,
      totalFailed
    } satisfies CheckoutStats
  }
})
