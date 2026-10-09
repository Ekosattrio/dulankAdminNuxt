import type { PaymentGatewaysRecord } from '#server/types/payment-gateway'
import { savePaymentGateways } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentGatewaysRecord>(event)
  const saved = savePaymentGateways(body)
  return { success: true, data: saved }
})
