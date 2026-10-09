import { getAnnualReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getAnnualReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Annual reports fetched successfully',
  }
})
