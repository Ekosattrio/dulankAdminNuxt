import { saveCouponItem } from '#server/utils/promoData'
import type { CouponFormData } from '#server/types/promo'

export default defineEventHandler(async (event) => {
  const body = await readBody<CouponFormData>(event)
  if (!body?.name?.trim() || !body?.code?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Code are required' })
  }

  const saved = saveCouponItem(body)
  return {
    success: true,
    data: saved,
    message: body.id ? 'Coupon updated successfully' : 'Coupon created successfully'
  }
})

