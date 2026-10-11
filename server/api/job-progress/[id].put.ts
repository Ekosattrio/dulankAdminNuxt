import type { JobProgressUpdate } from '#server/types/job-progress'
import { updateJobProgress } from '#server/utils/jobProgress'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  return createResponse(updateJobProgress(id, await readBody<JobProgressUpdate>(event)), 'Job progress updated')
})
