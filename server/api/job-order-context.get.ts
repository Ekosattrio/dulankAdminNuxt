import { getJobOrderContext } from '#server/utils/jobOrders'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const jobOrderId = String(query.id ?? '').trim() || undefined
  const orderId = String(query.orderId ?? '').trim() || undefined
  return createResponse(getJobOrderContext(jobOrderId, orderId))
})
