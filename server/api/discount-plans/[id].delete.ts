import { deleteDiscountPlanItem } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const ok = deleteDiscountPlanItem(id)
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'Discount plan not found' })
  }

  return {
    success: true,
    message: 'Discount plan deleted successfully'
  }
})

