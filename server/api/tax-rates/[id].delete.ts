import { createError, defineEventHandler } from 'h3'
import { deleteTaxRate } from '#server/utils/taxRatesData'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const deleted = deleteTaxRate(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Tax rate not found' })
  }

  return {
    success: true,
    message: 'Tax rate deleted successfully'
  }
})

