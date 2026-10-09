import { deleteMyJob } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteMyJob(id)
  return createResponse(result, 'Job task deleted successfully')
})
