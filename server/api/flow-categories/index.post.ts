import type { FlowCategoryFormData } from '#server/types/flow-category'
import { createFlowCategory } from '#server/utils/flowCategory'

export default defineEventHandler(async (event) => {
  const body = await readBody<FlowCategoryFormData>(event)
  const item = createFlowCategory(body)
  return createResponse(item, { message: 'Flow category created successfully' })
})
