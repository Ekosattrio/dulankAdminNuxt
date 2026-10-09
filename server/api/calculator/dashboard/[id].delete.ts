import { createError, defineEventHandler } from 'h3'
import { deleteCalculatorDashboardUser } from '#server/utils/calculatorDashboardData'

export default defineEventHandler(async (event) => {
  const rawId = event.context.params?.id
  const id = Number(rawId)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const deleted = deleteCalculatorDashboardUser(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'User record not found' })
  }

  return {
    success: true,
    message: 'User record deleted successfully'
  }
})

