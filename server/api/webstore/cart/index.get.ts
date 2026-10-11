import type { CartFilterQuery } from '#server/types/cart'
import { listCarts } from '#server/utils/webstoreLists'

export default defineEventHandler(async (event) => {
  const result = await listCarts(getQuery(event) as CartFilterQuery)
  return { success: true, ...result }
})
