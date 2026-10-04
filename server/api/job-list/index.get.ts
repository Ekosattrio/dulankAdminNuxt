import type { JobListFilterParams } from '#server/types/job-list'
import { listJobItems } from '#server/utils/jobList'

export default defineEventHandler((event) => {
  const query = getQuery<JobListFilterParams>(event)
  const items = listJobItems(query)
  return createResponse(items)
})
