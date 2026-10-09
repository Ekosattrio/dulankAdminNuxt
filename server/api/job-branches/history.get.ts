import { getJobBranchesHistory } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getJobBranchesHistory({
    search: query.search as string,
    branch: query.branch as string,
    startDate: query.startDate as string,
    endDate: query.endDate as string,
  })

  return {
    success: true,
    data: items,
  }
})
