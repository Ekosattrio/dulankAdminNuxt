import { deleteSubscription } from '#server/utils/subscriptions'

export default defineEventHandler(event => ({
  success: true,
  data: deleteSubscription(getRouterParam(event, 'id') || ''),
  message: 'Subscription deleted successfully',
}))
