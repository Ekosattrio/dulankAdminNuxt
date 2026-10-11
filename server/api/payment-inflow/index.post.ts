import type { PaymentFlowFormData } from '#server/types/payment-flow'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const record = savePaymentFlow('inflow', body)
  return createResponse(record, body.id ? 'Payment inflow updated successfully' : 'Payment inflow created successfully')
})
