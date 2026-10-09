import { getJobOrders } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getJobOrders({
    search: query.search as string,
    status: query.status as string,
    priority: query.priority as string,
    workflowCategory: query.workflowCategory as string,
    workflowType: query.workflowType as string,
  })

  return createResponse(filtered, 'Job orders fetched successfully')
})
