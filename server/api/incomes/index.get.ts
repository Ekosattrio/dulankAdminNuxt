import { defineEventHandler, getQuery } from 'h3'
import { getIncomeRecords } from '#server/utils/financeTransactionData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { success: true, data: getIncomeRecords({
    search: typeof query.search === 'string' ? query.search : undefined,
    category: typeof query.category === 'string' ? query.category : undefined,
  }) }
})
