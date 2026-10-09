import { defineEventHandler, getQuery } from 'h3'
import { getBankStatementRows } from '#server/utils/financeReportData'
export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { success: true, data: getBankStatementRows({
    accountId: typeof query.accountId === 'string' ? query.accountId : undefined,
    startDate: typeof query.startDate === 'string' ? query.startDate : undefined,
    endDate: typeof query.endDate === 'string' ? query.endDate : undefined,
    search: typeof query.search === 'string' ? query.search : undefined,
  }) }
})
