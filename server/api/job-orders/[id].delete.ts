import type { JobOrder } from '~/types/job-order'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job Order ID is required'
    })
  }

  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])
  const newOrders = allOrders.filter(j => j.id !== id && j.no !== id)

  if (allOrders.length === newOrders.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job order not found'
    })
  }

  await writeJSON('job-orders.json', newOrders)

  return createResponse({ id }, 'Job order deleted successfully')
})

