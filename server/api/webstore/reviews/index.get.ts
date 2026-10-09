import { getReviews } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getReviews(query)

  return {
    success: true,
    data: result.data,
    stats: result.stats,
  }
})
