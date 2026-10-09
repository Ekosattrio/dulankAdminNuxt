import type { FlowTemplateFilterParams } from '#server/types/flow-template'
import { listFlowTemplates } from '#server/utils/flowTemplate'

export default defineEventHandler((event) => {
  const query = getQuery<FlowTemplateFilterParams>(event)
  const items = listFlowTemplates(query)
  return createResponse(items, { total: items.length })
})
