import { deleteOnlineOrder } from '#server/utils/onlineOrderData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })
  }

  await deleteOnlineOrder(id)
  return {
    success: true,
    message: 'Order deleted successfully',
  }
})

