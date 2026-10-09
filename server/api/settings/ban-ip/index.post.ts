import { createError, defineEventHandler, readBody } from 'h3'
import { createBanIp } from '#server/utils/banIpData'
import type { BanIpInput } from '#server/types/ban-ip'

export default defineEventHandler(async (event) => {
  const body = await readBody<BanIpInput>(event)
  if (!body || !body.ip || !body.reason) {
    throw createError({ statusCode: 400, statusMessage: 'IP Address and Reason are required' })
  }

  const created = createBanIp(body)
  return {
    success: true,
    data: created,
    message: 'IP address banned successfully'
  }
})

