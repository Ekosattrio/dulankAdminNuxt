import type { SmsGatewaysRecord } from '#server/types/sms-gateway'
import { saveSmsGateways } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<SmsGatewaysRecord>(event)
  const saved = saveSmsGateways(body)
  return { success: true, data: saved }
})
