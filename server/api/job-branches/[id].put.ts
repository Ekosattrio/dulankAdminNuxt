import type { JobBranchUpdatePayload } from '#server/types/job-branch'
import { updateJobBranch } from '#server/utils/jobBranch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Record ID is required' })
  }

  const body = await readBody<JobBranchUpdatePayload>(event)
  const item = updateJobBranch(id, body)
  return createResponse(item, { message: 'Job branch updated successfully' })
})
