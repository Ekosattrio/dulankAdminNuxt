import { getOnlineOrders } from '#server/utils/onlineOrderData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const orders = await getOnlineOrders({
    search: query.search as string,
    status: query.status as string,
    paymentStatus: query.paymentStatus as string,
  })

  return {
    success: true,
    data: orders,
  }
})

