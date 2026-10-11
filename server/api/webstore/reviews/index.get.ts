import type { ReviewFilterQuery } from '#server/types/review'
import { listReviews } from '#server/utils/webstoreLists'

export default defineEventHandler(async (event) => {
  const result = await listReviews(getQuery(event) as ReviewFilterQuery)
  return { success: true, ...result }
})
