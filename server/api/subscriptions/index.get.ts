import type { SubscriptionFilterQuery } from '#server/types/subscription'
import { listSubscriptions } from '#server/utils/subscriptions'

export default defineEventHandler(event => ({
  success: true,
  ...listSubscriptions(getQuery(event) as SubscriptionFilterQuery),
}))
