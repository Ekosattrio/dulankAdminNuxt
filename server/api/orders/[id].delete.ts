import { deleteOrder } from '#server/utils/order'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })
  }

  const item = deleteOrder(id)
  return createResponse(item, { message: 'Order deleted successfully' })
})
