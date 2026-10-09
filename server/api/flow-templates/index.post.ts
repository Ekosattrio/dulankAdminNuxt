import type { FlowTemplateFormData } from '#server/types/flow-template'
import { createFlowTemplate } from '#server/utils/flowTemplate'

export default defineEventHandler(async (event) => {
  const body = await readBody<FlowTemplateFormData>(event)
  const item = createFlowTemplate(body)
  return createResponse(item, { message: 'Flow template created successfully' })
})
