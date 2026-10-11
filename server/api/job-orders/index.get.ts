import type { JobOrderFilterParams } from '#server/types/job-order'
import { getJobOrderCounts, listJobOrders } from '#server/utils/jobOrders'

export default defineEventHandler((event) => {
  const items = listJobOrders(getQuery<JobOrderFilterParams>(event))
  return createResponse(items, { workflowCounts: getJobOrderCounts() })
})

