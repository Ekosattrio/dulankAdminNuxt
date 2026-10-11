import type { JobBranchFilterParams } from '#server/types/job-branch'
import { listJobBranchHistory } from '#server/utils/jobBranch'

export default defineEventHandler((event) => {
  return createResponse(listJobBranchHistory(getQuery<JobBranchFilterParams>(event)))
})
