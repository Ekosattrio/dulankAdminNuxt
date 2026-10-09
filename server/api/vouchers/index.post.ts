import { saveVoucherItem } from '#server/utils/promoData'
import type { VoucherFormData } from '#server/types/promo'

export default defineEventHandler(async (event) => {
  const body = await readBody<VoucherFormData>(event)
  if (!body?.name?.trim() || !body?.code?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Code are required' })
  }

  const saved = saveVoucherItem(body)
  return {
    success: true,
    data: saved,
    message: body.id ? 'Voucher updated successfully' : 'Voucher created successfully'
  }
})

