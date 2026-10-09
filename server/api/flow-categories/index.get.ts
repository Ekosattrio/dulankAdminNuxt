import type { FlowCategoryFilterParams } from '#server/types/flow-category'
import { listFlowCategories } from '#server/utils/flowCategory'

export default defineEventHandler((event) => {
  const query = getQuery<FlowCategoryFilterParams>(event)
  const items = listFlowCategories(query)
  return createResponse(items, { total: items.length })
})
