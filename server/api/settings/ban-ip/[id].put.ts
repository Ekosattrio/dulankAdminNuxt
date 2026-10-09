import { createError, defineEventHandler, readBody } from 'h3'
import { updateBanIp } from '#server/utils/banIpData'
import type { BanIpInput } from '#server/types/ban-ip'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody<Partial<BanIpInput>>(event)
  const updated = updateBanIp(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'IP record not found' })
  }

  return {
    success: true,
    data: updated,
    message: 'IP record updated successfully'
  }
})

