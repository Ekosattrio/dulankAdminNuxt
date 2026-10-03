import type { WorkFlowFormData } from '#server/types/work-flow'
import { updateWorkFlow } from '#server/utils/workFlow'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Workflow ID is required' })
  }

  const body = await readBody<WorkFlowFormData>(event)
  const item = updateWorkFlow(id, body)
  return createResponse(item, { message: 'Workflow updated successfully' })
})
