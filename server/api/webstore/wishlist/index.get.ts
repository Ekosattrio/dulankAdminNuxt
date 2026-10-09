import { getWishlists } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getWishlists(query)

  return {
    success: true,
    data: result.data,
    stats: result.stats,
  }
})
