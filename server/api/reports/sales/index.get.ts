import { getSalesReport } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getSalesReport(query)

  return createResponse(filtered, 'Sales reports fetched successfully')
})
