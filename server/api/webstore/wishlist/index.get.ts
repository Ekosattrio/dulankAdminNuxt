import type { WishlistItem, WishlistStats } from '~/types/wishlist'
import { isDateWithinRange } from '#server/utils/dateRange'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<WishlistItem[]>('wishlists.json', [])

  const totalWishlistAmount = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
  const totalWishlistActive = items.filter(i => i.status === 'Active').length
  const totalWishlistCheckout = items.filter(i => i.status === 'Checkout').length
  const totalWishlistDelete = items.filter(i => i.status === 'Delete').length

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.productName && item.productName.toLowerCase().includes(s)) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.category && item.category.toLowerCase().includes(s))
    )
  }

  if (query.category && query.category !== 'All' && query.category !== 'All Categories') {
    filtered = filtered.filter(item => item.category.toLowerCase() === String(query.category).toLowerCase())
  }

  if (query.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
    stats: {
      totalWishlistAmount,
      totalWishlistActive,
      totalWishlistCheckout,
      totalWishlistDelete
    } satisfies WishlistStats
  }
})
