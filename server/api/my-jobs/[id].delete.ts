import type { MyJob } from '~/types/my-job'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required'
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])
  const newJobs = allJobs.filter(j => j.id !== id)

  if (allJobs.length === newJobs.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found'
    })
  }

  await writeJSON('my-jobs.json', newJobs)

  return createResponse({ id }, 'Job task deleted successfully')
})

