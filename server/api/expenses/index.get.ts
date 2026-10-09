import { defineEventHandler, getQuery } from 'h3'
import { getExpenseRecords } from '#server/utils/financeTransactionData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { success: true, data: getExpenseRecords({
    search: typeof query.search === 'string' ? query.search : undefined,
    status: typeof query.status === 'string' ? query.status : undefined,
    category: typeof query.category === 'string' ? query.category : undefined,
  }) }
})
