import type { JobBranchFilterParams } from '#server/types/job-branch'
import { listJobBranches } from '#server/utils/jobBranch'

export default defineEventHandler((event) => {
  const query = getQuery<JobBranchFilterParams>(event)
  const items = listJobBranches(query)
  return createResponse(items)
})
