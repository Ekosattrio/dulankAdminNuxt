import { deleteMyJob } from '#server/utils/myJobs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required'
    })
  }

  return createResponse(deleteMyJob(id), 'Job task deleted successfully')
})

