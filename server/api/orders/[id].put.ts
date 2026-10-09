import type { OrderStatus } from '#server/types/order'
import { updateOrderStatus } from '#server/utils/order'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })
  }

  const body = await readBody<{ status: OrderStatus; statusBy?: string }>(event)
  if (!body.status) {
    throw createError({ statusCode: 400, statusMessage: 'Order status is required' })
  }

  const item = updateOrderStatus(id, body.status, body.statusBy || 'Admin')
  return createResponse(item, { message: 'Order status updated successfully' })
})
