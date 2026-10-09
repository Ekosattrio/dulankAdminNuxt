import { defineEventHandler, getQuery } from 'h3'
import { getBalanceSheetStatement } from '#server/utils/financeReportData'
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const asOfDate = typeof query.asOfDate === 'string' ? query.asOfDate : new Date().toISOString().slice(0, 10)
  return { success: true, data: getBalanceSheetStatement(asOfDate) }
})

