import type { FlowNameFormData } from '#server/types/flow-name'
import { updateFlowName } from '#server/utils/flowName'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Flow name ID is required' })
  }

  const body = await readBody<FlowNameFormData>(event)
  const item = updateFlowName(id, body)
  return createResponse(item, { message: 'Flow name updated successfully' })
})
