import { getDiscountsList } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = getDiscountsList({
    search: typeof query.search === 'string' ? query.search : undefined,
    planId: typeof query.planId === 'string' ? query.planId : undefined,
    status: typeof query.status === 'string' ? query.status : undefined,
  })

  return {
    success: true,
    data: items,
    message: 'Discounts loaded successfully'
  }
})

