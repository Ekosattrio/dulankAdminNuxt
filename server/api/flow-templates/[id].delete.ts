import { deleteFlowTemplate } from '#server/utils/flowTemplate'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template ID is required' })
  }

  const removed = deleteFlowTemplate(id)
  return createResponse(removed, { message: 'Flow template deleted successfully' })
})
