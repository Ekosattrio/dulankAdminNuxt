import { deleteFlowName } from '#server/utils/flowName'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Flow name ID is required' })
  }

  const removed = deleteFlowName(id)
  return createResponse(removed, { message: 'Flow name deleted successfully' })
})
