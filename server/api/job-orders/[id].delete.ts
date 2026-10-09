import { deleteJobOrder } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteJobOrder(id)
  return createResponse(result, 'Job order deleted successfully')
})
