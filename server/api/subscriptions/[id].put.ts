import type { SubscriptionUpdateCommand } from '#server/types/subscription'
import { updateSubscription } from '#server/utils/subscriptions'

export default defineEventHandler(async event => ({
  success: true,
  data: updateSubscription(getRouterParam(event, 'id') || '', await readBody<SubscriptionUpdateCommand>(event)),
  message: 'Subscription updated successfully',
}))
