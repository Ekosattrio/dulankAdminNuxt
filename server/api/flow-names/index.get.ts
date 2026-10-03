import type { FlowNameFilterParams } from '#server/types/flow-name'
import { listFlowNames } from '#server/utils/flowName'

export default defineEventHandler((event) => {
  const query = getQuery<FlowNameFilterParams>(event)
  const items = listFlowNames(query)
  return createResponse(items, { total: items.length })
})
