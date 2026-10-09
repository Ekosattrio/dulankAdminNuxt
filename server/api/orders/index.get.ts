import type { OrderFilterParams } from '#server/types/order'
import { listOrders } from '#server/utils/order'

export default defineEventHandler((event) => {
  const query = getQuery<OrderFilterParams>(event)
  const items = listOrders(query)
  return createResponse(items)
})
