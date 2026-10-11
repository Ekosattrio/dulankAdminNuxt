import { randomUUID } from 'node:crypto'
import type { Quotation, QuotationDocument, QuotationFilterParams, QuotationFormData } from '#server/types/quotation'

const FILE = 'quotations.json'
const today = () => new Date().toLocaleDateString('en-GB')
const displayDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value

export function listQuotations(filters: QuotationFilterParams = {}) {
  const search = filters.search?.toLowerCase().trim() || ''
  return readSalesData<Quotation>(FILE).filter((item) => {
    const haystack = [item.noQuotation, item.customer, item.email].join(' ').toLowerCase()
    return (!search || haystack.includes(search)) && (!filters.status || filters.status === 'All' || item.status === filters.status)
  })
}

function calculateDocument(document: QuotationDocument, existing?: Quotation) {
  if (!Array.isArray(document.items) || document.items.some((item) =>
    !item.productName?.trim() || !Number.isFinite(item.order) || item.order <= 0 ||
    !Number.isFinite(item.moq) || item.moq <= 0 || item.order < item.moq ||
    !Number.isFinite(item.unitPrice) || item.unitPrice < 0,
  ) || !Number.isFinite(document.shippingCost) || document.shippingCost < 0 ||
    !Number.isFinite(document.taxRate) || document.taxRate < 0 || document.taxRate > 100)
    throw createError({ statusCode: 400, statusMessage: 'Check quotation products, quantities and charges' })
  if (!document.items.length) {
    if (!existing) throw createError({ statusCode: 400, statusMessage: 'Add at least one product' })
    return { document: { ...document, legacyTotal: existing.total }, total: existing.total }
  }
  const items = document.items.map((item) => ({ ...item, amount: item.order * item.unitPrice }))
  const base = items.reduce((sum, item) => sum + item.amount, 0) + document.shippingCost
  const total = base + (document.pricesIncludeTax ? 0 : Math.round((base * document.taxRate) / 100))
  const calculated = { ...document, items }
  delete calculated.legacyTotal
  return { document: calculated, total }
}

export async function saveQuotation(body: QuotationFormData) {
  if (!body?.customer?.trim()) throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  if (!['Send', 'Ordered', 'Rejected', 'Complete', 'Pending'].includes(body.status))
    throw createError({ statusCode: 400, statusMessage: 'Invalid quotation status' })
  const records = readSalesData<Quotation>(FILE)
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Quotation not found' })
  const previous = index >= 0 ? records[index] : undefined
  const calculated = body.document ? calculateDocument(body.document, previous) : null
  const total = calculated?.total ?? Number(body.total)
  if (!Number.isFinite(total) || total < 0) throw createError({ statusCode: 400, statusMessage: 'Invalid quotation amount' })
  const next = Math.max(0, ...records.map((item) => Number(item.noQuotation.replace(/\D/g, '')) || 0)) + 1
  const record: Quotation = {
    id: previous?.id || randomUUID(),
    noQuotation: previous?.noQuotation || body.noQuotation || `QUO${String(next).padStart(5, '0')}`,
    date: calculated?.document.date ? displayDate(calculated.document.date) : previous?.date || today(),
    customer: body.customer.trim(),
    email: body.email?.trim() || '',
    status: body.status || previous?.status || 'Send',
    dateStatus: body.status && body.status !== previous?.status ? today() : previous?.dateStatus || today(),
    total,
    channel: body.channel || previous?.channel || 'Online',
    dueDate: body.dueDate || previous?.dueDate || today(),
    document: calculated?.document ?? previous?.document,
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  await writeJSON(FILE, records)
  return record
}

export async function deleteQuotation(id: string) {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Quotation ID is required' })
  const records = readSalesData<Quotation>(FILE)
  const remaining = records.filter((item) => item.id !== id && item.noQuotation !== id)
  if (remaining.length === records.length) throw createError({ statusCode: 404, statusMessage: 'Quotation not found' })
  await writeJSON(FILE, remaining)
  return { id }
}
