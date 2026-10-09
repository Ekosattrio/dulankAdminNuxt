import { saveDiscountPlanItem } from '#server/utils/promoData'
import type { DiscountPlanFormData } from '#server/types/promo'

export default defineEventHandler(async (event) => {
  const body = await readBody<DiscountPlanFormData>(event)
  if (!body?.planName?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Plan Name is required' })
  }

  const saved = saveDiscountPlanItem(body)
  return {
    success: true,
    data: saved,
    message: body.id ? 'Discount plan updated successfully' : 'Discount plan created successfully'
  }
})

