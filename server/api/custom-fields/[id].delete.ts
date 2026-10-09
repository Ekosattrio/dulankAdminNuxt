import { createError, defineEventHandler } from 'h3'
import { deleteCustomField } from '#server/utils/customFieldsData'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const deleted = deleteCustomField(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Custom field not found' })
  }

  return {
    success: true,
    message: 'Custom field deleted successfully'
  }
})

