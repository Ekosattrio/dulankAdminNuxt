import { getCustomerReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getCustomerReports(query)

  return createResponse(filtered, 'Customer reports fetched successfully')
})
