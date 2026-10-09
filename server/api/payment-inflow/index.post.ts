import type { PaymentFlowFormData } from '#server/types/payment-flow'
import { savePaymentInflowDomain } from '~~/server/utils/paymentFlowData'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const { record, isNew } = await savePaymentInflowDomain(body)
  return createResponse(record, isNew ? 'Payment inflow created successfully' : 'Payment inflow updated successfully')
})
