import { deleteCouponItem } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const ok = deleteCouponItem(id)
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'Coupon not found' })
  }

  return {
    success: true,
    message: 'Coupon deleted successfully'
  }
})

