import type { WishlistFilterQuery } from '#server/types/wishlist'
import { listWishlists } from '#server/utils/webstoreLists'

export default defineEventHandler(async (event) => {
  const result = await listWishlists(getQuery(event) as WishlistFilterQuery)
  return { success: true, ...result }
})
