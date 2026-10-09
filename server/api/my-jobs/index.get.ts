import { getMyJobs } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getMyJobs({
    search: query.search as string,
    priority: query.priority as string,
    status: query.status as string,
  })

  return createResponse(filtered, 'My jobs fetched successfully')
})
