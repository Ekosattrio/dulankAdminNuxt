import { getPurchaseReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getPurchaseReports(query)

  return createResponse(filtered, 'Purchase reports fetched successfully')
})
