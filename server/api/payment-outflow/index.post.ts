import type { PaymentFlowFormData } from '#server/types/payment-flow'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const record = savePaymentFlow('outflow', body)
  return createResponse(record, body.id ? 'Payment outflow updated successfully' : 'Payment outflow created successfully')
})
