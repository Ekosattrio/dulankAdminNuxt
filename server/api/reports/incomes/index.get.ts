import { getIncomeReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getIncomeReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Income reports fetched successfully',
  }
})
