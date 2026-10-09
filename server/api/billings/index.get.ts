import { getBillings, getBillingStats } from '../../utils/billingData'

export default defineEventHandler(async () => {
  const [billings, stats] = await Promise.all([
    getBillings(),
    getBillingStats()
  ])

  return {
    success: true,
    data: billings,
    stats
  }
})

