import type { FlowTemplateFormData } from '#server/types/flow-template'
import { updateFlowTemplate } from '#server/utils/flowTemplate'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template ID is required' })
  }

  const body = await readBody<FlowTemplateFormData>(event)
  const item = updateFlowTemplate(id, body)
  return createResponse(item, { message: 'Flow template updated successfully' })
})
