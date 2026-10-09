import { getProductReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getProductReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Product reports fetched successfully',
  }
})
