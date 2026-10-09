import type { ReviewItem, ReviewStats } from '~/types/review'
import { isDateWithinRange } from '#server/utils/dateRange'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<ReviewItem[]>('reviews.json', [])

  const totalReview = items.length
  const uniqueProducts = new Set(items.map(i => i.productId || i.productName))
  const totalProduct = uniqueProducts.size
  const totalPublish = items.filter(i => i.status === 'Publish').length

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.productId && item.productId.toLowerCase().includes(s)) ||
      (item.productName && item.productName.toLowerCase().includes(s)) ||
      (item.title && item.title.toLowerCase().includes(s)) ||
      (item.review && item.review.toLowerCase().includes(s))
    )
  }

  if (query.rating && query.rating !== 'All' && query.rating !== 'All Rating') {
    filtered = filtered.filter(item => String(item.rating) === String(query.rating))
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
    stats: {
      totalReview,
      totalProduct,
      totalPublish
    } satisfies ReviewStats
  }
})
