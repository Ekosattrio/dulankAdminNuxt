import { createError, defineEventHandler, readBody } from 'h3'
import { updateCustomField } from '#server/utils/customFieldsData'
import type { CustomFieldInput } from '#server/types/custom-fields'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody<Partial<CustomFieldInput>>(event)
  const updated = updateCustomField(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Custom field not found' })
  }

  return {
    success: true,
    data: updated,
    message: 'Custom field updated successfully'
  }
})

