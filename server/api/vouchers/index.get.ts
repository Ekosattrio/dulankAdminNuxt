import { getVouchersList } from '#server/utils/promoData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = getVouchersList({
    search: typeof query.search === 'string' ? query.search : undefined,
    type: typeof query.type === 'string' ? query.type : undefined,
    status: typeof query.status === 'string' ? query.status : undefined,
  })

  return {
    success: true,
    data: items,
    message: 'Vouchers loaded successfully'
  }
})

