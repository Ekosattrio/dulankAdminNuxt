import { getCustomerDueReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getCustomerDueReports(query)

  return createResponse(filtered, 'Customer due reports fetched successfully')
})
