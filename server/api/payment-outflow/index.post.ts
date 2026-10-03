import type { PaymentFlowFormData, PaymentFlowRecord } from '#server/types/payment-flow'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-outflows.json')

  if (body.id) {
    const index = records.findIndex((record) => record.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Payment outflow not found' })
    records[index] = normalizePaymentFlow('outflow', body, records[index])
    writeJSON('payment-outflows.json', records)
    return createResponse(records[index], 'Payment outflow updated successfully')
  }

  const next = normalizePaymentFlow('outflow', body)
  records.unshift(next)
  writeJSON('payment-outflows.json', records)
  return createResponse(next, 'Payment outflow created successfully')
})
