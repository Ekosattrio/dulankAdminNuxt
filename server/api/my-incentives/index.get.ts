import { getMyIncentives } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const result = await getMyIncentives({
    search: query.search as string,
    process: query.process as string,
    status: query.status as string,
    startDate: query.startDate as string,
    endDate: query.endDate as string,
  })

  return {
    success: true,
    data: result.items,
    stats: result.stats,
  }
})
