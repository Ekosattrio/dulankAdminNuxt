import { defineEventHandler, getQuery } from 'h3'
import { getCashFlowStatement } from '#server/utils/financeReportData'
export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { success: true, data: getCashFlowStatement(
    typeof query.startDate === 'string' ? query.startDate : undefined,
    typeof query.endDate === 'string' ? query.endDate : undefined,
  ) }
})
