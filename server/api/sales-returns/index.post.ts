import type { SalesReturn, SalesReturnFormData } from '#server/types/sales-return'

export default defineEventHandler(async (event) => {
  const body = await readBody<SalesReturnFormData>(event)
  if (!body?.customer?.trim() || !body.salesNo?.trim() || !body.date?.trim())
    throw createError({ statusCode: 400, statusMessage: 'Customer, sales number and date are required' })
  if (!Number.isFinite(body.total) || body.total < 0)
    throw createError({ statusCode: 400, statusMessage: 'Invalid refund amount' })
  if (!['Paid', 'Unpaid'].includes(body.paymentStatus))
    throw createError({ statusCode: 400, statusMessage: 'Invalid payment status' })
  if (
    !Array.isArray(body.items) ||
    body.items.some(
      (item) =>
        !item.name?.trim() ||
        !Number.isFinite(item.qtyOrder) ||
        !Number.isFinite(item.qtyReturn) ||
        !Number.isFinite(item.price) ||
        item.qtyOrder < 0 ||
        item.qtyReturn <= 0 ||
        item.qtyReturn > item.qtyOrder ||
        item.price < 0,
    )
  )
    throw createError({ statusCode: 400, statusMessage: 'Check returned quantities and prices' })
  const records = readSalesData<SalesReturn>('sales-returns.json')
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  const previous = index >= 0 ? records[index] : undefined
  const next = Math.max(0, ...records.map((item) => Number(item.returnNo.replace(/\D/g, '')) || 0)) + 1
  const items = body.items.map((item) => ({ ...item, returnAmount: item.qtyReturn * item.price }))
  const record: SalesReturn = {
    ...previous,
    id: previous?.id ?? Math.max(Date.now(), ...records.map((item) => item.id + 1)),
    returnNo: previous?.returnNo ?? `RTN${String(next).padStart(4, '0')}`,
    customer: body.customer.trim(),
    salesNo: body.salesNo.trim(),
    date: body.date,
    paymentStatus: body.paymentStatus,
    paymentDate: body.paymentStatus === 'Paid' ? previous?.paymentDate || body.date : '',
    paymentMethod: body.paymentStatus === 'Paid' ? previous?.paymentMethod || 'Cash' : '',
    total: body.total,
    items,
    notes: body.notes || '',
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  writeJSON('sales-returns.json', records)
  return createResponse(record)
})
