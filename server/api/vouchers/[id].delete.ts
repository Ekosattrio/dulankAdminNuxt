import { deleteVoucherItem } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const ok = deleteVoucherItem(id)
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'Voucher not found' })
  }

  return {
    success: true,
    message: 'Voucher deleted successfully'
  }
})

