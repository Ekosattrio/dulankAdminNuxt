import type { FlowCategoryFormData } from '#server/types/flow-category'
import { updateFlowCategory } from '#server/utils/flowCategory'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  const body = await readBody<FlowCategoryFormData>(event)
  const item = updateFlowCategory(id, body)
  return createResponse(item, { message: 'Flow category updated successfully' })
})
