import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { PaymentGatewaysRecord } from '~~/server/types/payment-gateway'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentGatewaysRecord>(event)
  await writeJSON('payment-gateways.json', body)
  return { success: true, data: body }
})

