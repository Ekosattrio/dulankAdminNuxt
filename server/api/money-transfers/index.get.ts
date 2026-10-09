import { defineEventHandler, getQuery } from 'h3'
import { getMoneyTransfers } from '#server/utils/moneyTransferData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return {
    success: true,
    data: getMoneyTransfers({
      search: typeof query.search === 'string' ? query.search : undefined,
      startDate: typeof query.startDate === 'string' ? query.startDate : undefined,
      endDate: typeof query.endDate === 'string' ? query.endDate : undefined,
    }),
  }
})

