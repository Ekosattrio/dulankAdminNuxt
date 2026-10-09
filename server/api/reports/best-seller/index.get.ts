import { getBestSellerReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getBestSellerReports(query)

  return createResponse(filtered, 'Best seller reports fetched successfully')
})
