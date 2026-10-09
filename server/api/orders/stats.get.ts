import { getOrderStats } from '#server/utils/order'

export default defineEventHandler(() => {
  const stats = getOrderStats()
  return createResponse(stats)
})
