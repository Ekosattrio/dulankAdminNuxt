import type { FlowNameFormData } from '#server/types/flow-name'
import { createFlowName } from '#server/utils/flowName'

export default defineEventHandler(async (event) => {
  const body = await readBody<FlowNameFormData>(event)
  const item = createFlowName(body)
  return createResponse(item, { message: 'Flow name created successfully' })
})
