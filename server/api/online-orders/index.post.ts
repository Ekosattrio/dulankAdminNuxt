import { saveOnlineOrder } from '#server/utils/onlineOrderData'
import type { OnlineOrderFormData } from '#server/types/online-order'

export default defineEventHandler(async (event) => {
  const body = await readBody<OnlineOrderFormData & { id?: number | string }>(event)
  if (!body || !body.customer) {
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  }

  const saved = await saveOnlineOrder(body, body.id)
  return {
    success: true,
    data: saved,
    message: body.id ? 'Order updated successfully' : 'Order created successfully',
  }
})

