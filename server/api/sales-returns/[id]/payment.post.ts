import type { SalesReturn, ReturnPayment } from '#server/types/sales-return'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<ReturnPayment>(event)
  const records = readSalesData<SalesReturn>('sales-returns.json')
  const record = records.find((item) => item.id === id)
  if (!record) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  if (record.paymentStatus === 'Paid')
    throw createError({ statusCode: 409, statusMessage: 'This refund was already recorded' })
  if (
    !body ||
    !['Cash', 'Transfer'].includes(body.method) ||
    !Number.isFinite(body.amount) ||
    body.amount !== record.total
  )
    throw createError({ statusCode: 400, statusMessage: 'Payment must match the total refund due' })
  if (
    body.method === 'Transfer' &&
    (!body.bankName?.trim() || !body.accountName?.trim() || !body.accountNumber?.trim())
  )
    throw createError({ statusCode: 400, statusMessage: 'Bank and account details are required' })
  record.paymentStatus = 'Paid'
  record.paymentMethod = body.method
  record.paymentDate = new Date().toLocaleDateString('en-GB')
  record.payment = body
  writeJSON('sales-returns.json', records)
  return createResponse(record)
})
