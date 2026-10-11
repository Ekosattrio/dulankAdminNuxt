import type { CheckoutFilterQuery } from '#server/types/checkout'
import { listCheckouts } from '#server/utils/webstoreLists'

export default defineEventHandler(async (event) => {
  const result = await listCheckouts(getQuery(event) as CheckoutFilterQuery)
  return { success: true, ...result }
})
