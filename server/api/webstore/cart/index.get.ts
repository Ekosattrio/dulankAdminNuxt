import { getCarts } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getCarts(query)

  return {
    success: true,
    data: result.data,
    stats: result.stats,
  }
})
