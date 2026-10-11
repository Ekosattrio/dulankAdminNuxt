import type { ReturnPayment, SalesReturn, SalesReturnFormData } from '#server/types/sales-return'

const FILE = 'sales-returns.json'

export function listSalesReturns() {
  return readSalesData<SalesReturn>(FILE)
}

export async function saveSalesReturn(body: SalesReturnFormData) {
  if (!body?.customer?.trim() || !body.salesNo?.trim() || !body.date?.trim())
    throw createError({ statusCode: 400, statusMessage: 'Customer, sales number and date are required' })
  if (!['Paid', 'Unpaid'].includes(body.paymentStatus))
    throw createError({ statusCode: 400, statusMessage: 'Invalid payment status' })
  if (!Array.isArray(body.items) || !body.items.length || body.items.some((item) =>
    !item.name?.trim() || !Number.isFinite(item.qtyOrder) || !Number.isFinite(item.qtyReturn) ||
    !Number.isFinite(item.price) || item.qtyOrder < 0 || item.qtyReturn <= 0 ||
    item.qtyReturn > item.qtyOrder || item.price < 0,
  )) throw createError({ statusCode: 400, statusMessage: 'Check returned quantities and prices' })
  const records = readSalesData<SalesReturn>(FILE)
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  const previous = index >= 0 ? records[index] : undefined
  const items = body.items.map((item) => ({ ...item, returnAmount: item.qtyReturn * item.price }))
  const total = items.reduce((sum, item) => sum + item.returnAmount, 0)
  const next = Math.max(0, ...records.map((item) => Number(item.returnNo.replace(/\D/g, '')) || 0)) + 1
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
    total,
    items,
    notes: body.notes?.trim() || '',
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  await writeJSON(FILE, records)
  return record
}

export async function deleteSalesReturn(id: number) {
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Sales return ID is required' })
  const records = readSalesData<SalesReturn>(FILE)
  const remaining = records.filter((item) => item.id !== id)
  if (remaining.length === records.length) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  await writeJSON(FILE, remaining)
  return { id }
}

export async function recordSalesReturnPayment(id: number, body: ReturnPayment) {
  const records = readSalesData<SalesReturn>(FILE)
  const record = records.find((item) => item.id === id)
  if (!record) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  if (record.paymentStatus === 'Paid')
    throw createError({ statusCode: 409, statusMessage: 'This refund was already recorded' })
  if (!body || !['Cash', 'Transfer'].includes(body.method) || !Number.isFinite(body.amount) || body.amount !== record.total)
    throw createError({ statusCode: 400, statusMessage: 'Payment must match the total refund due' })
  if (body.method === 'Transfer' && (!body.bankName?.trim() || !body.accountName?.trim() || !body.accountNumber?.trim()))
    throw createError({ statusCode: 400, statusMessage: 'Bank and account details are required' })
  record.paymentStatus = 'Paid'
  record.paymentMethod = body.method
  record.paymentDate = new Date().toLocaleDateString('en-GB')
  record.payment = { ...body, notes: body.notes?.trim() || '', reference: body.reference?.trim() }
  await writeJSON(FILE, records)
  return record
}
