import { deleteSubscription } from '../../utils/subscriptionData'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid subscription ID' })
  }

  await deleteSubscription(id)
  return {
    success: true,
    message: 'Subscription deleted successfully'
  }
})

