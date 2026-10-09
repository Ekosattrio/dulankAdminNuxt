import { defineEventHandler, getQuery } from 'h3'
import { getBankAccountList } from '#server/utils/bankAccountData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { items, stats } = getBankAccountList({
    search: typeof query.search === 'string' ? query.search : undefined,
    status: typeof query.status === 'string' ? query.status : undefined,
    accountTypeId: typeof query.accountTypeId === 'string' ? query.accountTypeId : undefined,
  })
  return { success: true, data: items, meta: { stats } }
})

