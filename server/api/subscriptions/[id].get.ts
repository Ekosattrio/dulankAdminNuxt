import { getSubscription } from '#server/utils/subscriptions'

export default defineEventHandler(event => ({
  success: true,
  data: getSubscription(getRouterParam(event, 'id') || ''),
}))
