import { deleteFlowCategory } from '#server/utils/flowCategory'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  const removed = deleteFlowCategory(id)
  return createResponse(removed, { message: 'Flow category deleted successfully' })
})
