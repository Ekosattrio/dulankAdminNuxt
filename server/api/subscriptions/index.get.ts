import { getSubscriptions, getSubscriptionStats } from '../../utils/subscriptionData'

export default defineEventHandler(async () => {
  const [items, stats] = await Promise.all([
    getSubscriptions(),
    getSubscriptionStats()
  ])

  return {
    success: true,
    data: items,
    stats
  }
})

