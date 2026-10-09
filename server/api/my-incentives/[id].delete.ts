import { deleteMyIncentive } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteMyIncentive(id)
  return {
    success: true,
    data: result,
  }
})
