import { createError, defineEventHandler, readBody } from 'h3'
import { updateCalculatorDashboardUser } from '#server/utils/calculatorDashboardData'

export default defineEventHandler(async (event) => {
  const rawId = event.context.params?.id
  const id = Number(rawId)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const updated = updateCalculatorDashboardUser(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'User record not found' })
  }

  return {
    success: true,
    data: updated,
    message: 'User record updated successfully'
  }
})

