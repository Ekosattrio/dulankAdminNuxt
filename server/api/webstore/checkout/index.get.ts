import { getCheckouts } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getCheckouts(query)

  return {
    success: true,
    data: result.data,
    stats: result.stats,
  }
})
