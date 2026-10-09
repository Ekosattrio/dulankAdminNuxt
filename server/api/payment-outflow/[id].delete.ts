import type { PaymentFlowRecord } from '#server/types/payment-flow'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Payment outflow ID is required' })
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-outflows.json')
  const next = records.filter((record) => record.id !== id && record.refNo !== id)
  if (next.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: 'Payment outflow not found' })
  }
  writeJSON('payment-outflows.json', next)
  return createResponse({ id }, 'Payment outflow deleted successfully')
})
