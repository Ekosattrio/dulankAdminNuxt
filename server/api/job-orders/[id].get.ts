import { getJobOrder } from '#server/utils/jobOrders'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Job Order ID is required' })
  return createResponse(getJobOrder(id))
})
