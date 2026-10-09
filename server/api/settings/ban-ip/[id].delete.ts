import { createError, defineEventHandler } from 'h3'
import { deleteBanIp } from '#server/utils/banIpData'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const deleted = deleteBanIp(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'IP record not found' })
  }

  return {
    success: true,
    message: 'IP address removed from ban list'
  }
})

