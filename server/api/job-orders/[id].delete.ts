import { deleteJobOrder } from '#server/utils/jobOrders'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job Order ID is required'
    })
  }

  return createResponse(deleteJobOrder(id), 'Job order deleted successfully')
})

