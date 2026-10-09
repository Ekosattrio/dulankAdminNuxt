import { getProfitLossReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getProfitLossReports(query)

  return {
    success: true,
    data: result.data,
    summary: result.summary,
    message: 'Profit & Loss report fetched successfully',
  }
})
