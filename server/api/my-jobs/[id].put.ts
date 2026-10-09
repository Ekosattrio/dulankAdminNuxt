import type { MyJobFormData } from '#server/types/my-job'
import { updateMyJob } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const body = await readBody<Partial<MyJobFormData>>(event)
  const updated = await updateMyJob(id, body)
  return createResponse(updated, 'Job updated successfully')
})
