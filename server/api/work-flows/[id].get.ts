import { getWorkFlowById } from '#server/utils/workFlow'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Workflow ID is required' })
  }

  const item = getWorkFlowById(id)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Workflow not found' })
  }

  return createResponse(item)
})
