import type { PaymentFlowFormData } from '#server/types/payment-flow'
import { savePaymentOutflowDomain } from '~~/server/utils/paymentFlowData'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const { record, isNew } = await savePaymentOutflowDomain(body)
  return createResponse(record, isNew ? 'Payment outflow created successfully' : 'Payment outflow updated successfully')
})
