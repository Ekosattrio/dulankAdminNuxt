import { randomUUID } from 'node:crypto'
import type { Sale } from '#server/types/sale'
import type { SalesPayment } from '#server/types/sales-document'
export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SalesPayment>>(event)
  const records = readSalesData<Sale>('sales.json')
  const sale = records.find((s) => s.id === getRouterParam(event, 'id'))
  if (!sale) throw createError({ statusCode: 404, statusMessage: 'Sale not found' })
  const paid = sale.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  if (sale.status === 'Paid') throw createError({ statusCode: 409, statusMessage: 'Sale is already paid' })
  if (!Number.isFinite(body.amount) || Number(body.amount) <= 0 || Number(body.amount) > sale.total - paid)
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment must be greater than zero and no more than the amount due',
    })
  if (!['Cash', 'Bank Transfer', 'Debit Card'].includes(body.method || ''))
    throw createError({ statusCode: 400, statusMessage: 'Invalid payment method' })
  const payment: SalesPayment = {
    id: `IN-${randomUUID().slice(0, 8)}`,
    date: new Date().toLocaleDateString('en-GB'),
    created: 'Admin',
    amount: Number(body.amount),
    method: body.method!,
    notes: body.notes || '',
  }
  sale.payments = [...(sale.payments || []), payment]
  sale.status = paid + payment.amount >= sale.total ? 'Paid' : 'Partial'
  sale.method = payment.method as Sale['method']
  writeJSON('sales.json', records)
  return createResponse(sale)
})
