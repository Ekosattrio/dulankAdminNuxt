import { getFlowTemplateById } from '#server/utils/flowTemplate'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template ID is required' })
  }

  const item = getFlowTemplateById(id)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Flow template not found' })
  }

  return createResponse(item)
})
