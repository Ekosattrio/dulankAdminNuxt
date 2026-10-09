import type { OrderFormData } from '#server/types/order'
import { createOrder } from '#server/utils/order'

export default defineEventHandler(async (event) => {
  const body = await readBody<OrderFormData>(event)
  const item = createOrder(body)
  return createResponse(item, { message: 'Order created successfully' })
})
