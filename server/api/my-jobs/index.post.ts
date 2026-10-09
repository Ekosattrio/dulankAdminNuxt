import type { MyJobFormData } from '#server/types/my-job'
import { saveMyJob } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyJobFormData>(event)
  const { job, isNew } = await saveMyJob(body)
  return createResponse(job, isNew ? 'Job task created successfully' : 'Job task updated successfully')
})
