import { getTaxReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getTaxReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Tax reports fetched successfully',
  }
})
