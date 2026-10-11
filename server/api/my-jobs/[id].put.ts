import type { MyJobStatusUpdatePayload } from '#server/types/my-job'
import { updateMyJob } from '#server/utils/myJobs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<MyJobStatusUpdatePayload>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required'
    })
  }

  return createResponse(updateMyJob(id, body), 'Job updated successfully')
})
