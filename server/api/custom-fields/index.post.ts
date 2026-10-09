import { createError, defineEventHandler, readBody } from 'h3'
import { createCustomField } from '#server/utils/customFieldsData'
import type { CustomFieldInput } from '#server/types/custom-fields'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomFieldInput>(event)
  if (!body || !body.module || !body.label) {
    throw createError({ statusCode: 400, statusMessage: 'Module and Label are required' })
  }

  const created = createCustomField(body)
  return {
    success: true,
    data: created,
    message: 'Custom field created successfully'
  }
})

