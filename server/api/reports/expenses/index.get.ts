import { getExpenseReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getExpenseReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Expense reports fetched successfully',
  }
})
