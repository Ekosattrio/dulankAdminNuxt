import { saveDiscountItem } from '#server/utils/promoData'
import type { DiscountFormData } from '#server/types/promo'

export default defineEventHandler(async (event) => {
  const body = await readBody<DiscountFormData>(event)
  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Discount Name is required' })
  }

  const saved = saveDiscountItem(body)
  return {
    success: true,
    data: saved,
    message: body.id ? 'Discount updated successfully' : 'Discount created successfully'
  }
})

