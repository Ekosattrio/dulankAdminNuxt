import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { SmsGatewaysRecord } from '~~/server/types/sms-gateway'

export default defineEventHandler(async (event) => {
  const body = await readBody<SmsGatewaysRecord>(event)
  await writeJSON('sms-gateways.json', body)
  return { success: true, data: body }
})

