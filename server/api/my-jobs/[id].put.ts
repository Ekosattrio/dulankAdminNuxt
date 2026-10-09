import type { MyJob, MyJobFormData } from '~/types/my-job'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<MyJobFormData>>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required'
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])
  const idx = allJobs.findIndex(j => String(j.id) === String(id))

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found'
    })
  }

  const current = allJobs[idx]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  }
  const updated: MyJob = {
    ...current,
    ...body,
    id: current.id
  }
  allJobs[idx] = updated

  await writeJSON('my-jobs.json', allJobs)

  return createResponse(updated, 'Job updated successfully')
})
