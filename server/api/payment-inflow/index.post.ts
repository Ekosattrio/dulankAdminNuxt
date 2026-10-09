import type { PaymentFlowFormData, PaymentFlowRecord } from '#server/types/payment-flow'

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentFlowFormData>(event)
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-inflows.json')

  if (body.id) {
    const index = records.findIndex((record) => record.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Payment inflow not found' })
    records[index] = normalizePaymentFlow('inflow', body, records[index])
    writeJSON('payment-inflows.json', records)
    return createResponse(records[index], 'Payment inflow updated successfully')
  }

  const next = normalizePaymentFlow('inflow', body)
  records.unshift(next)
  writeJSON('payment-inflows.json', records)
  return createResponse(next, 'Payment inflow created successfully')
})
