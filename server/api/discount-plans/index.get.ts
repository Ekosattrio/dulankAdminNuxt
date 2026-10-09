import { getDiscountPlansList } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = getDiscountPlansList({
    search: typeof query.search === 'string' ? query.search : undefined,
    status: typeof query.status === 'string' ? query.status : undefined,
  })

  return {
    success: true,
    data: items,
    message: 'Discount plans loaded successfully'
  }
})

