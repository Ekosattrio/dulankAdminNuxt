import { deleteMyIncentive } from '#server/utils/myIncentives'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Incentive ID is required' })
  return createResponse(deleteMyIncentive(id), 'Incentive deleted successfully')
})
