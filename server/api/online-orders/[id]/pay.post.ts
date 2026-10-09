import { recordOnlineOrderPayment } from '#server/utils/onlineOrderData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })
  }

  const body = await readBody<{ amount: number; paymentMethod: string }>(event)
  if (!body || !body.amount || body.amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Valid payment amount is required' })
  }

  const updated = await recordOnlineOrderPayment(id, body.amount, body.paymentMethod || 'Midtrans')
  return {
    success: true,
    data: updated,
    message: 'Payment recorded successfully',
  }
})

