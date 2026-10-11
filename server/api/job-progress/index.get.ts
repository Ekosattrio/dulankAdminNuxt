import type { JobProgressFilters } from '#server/types/job-progress'
import { getJobProgressStats, listJobProgress } from '#server/utils/jobProgress'

export default defineEventHandler((event) => {
  const query = getQuery<JobProgressFilters>(event)
  return createResponse(listJobProgress(query), { stats: getJobProgressStats() })
})
