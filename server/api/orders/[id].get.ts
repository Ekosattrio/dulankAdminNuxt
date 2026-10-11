import { getOrderById } from '#server/utils/order'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') || ''
  const order = getOrderById(id)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  return createResponse(order)
})
