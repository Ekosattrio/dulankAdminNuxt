import { randomUUID } from 'node:crypto'
import type { RFQItem } from '#server/types/request-quotation'

const FILE = 'request-quotations.json'

export function listRequestQuotations() {
  return readSalesData<RFQItem>(FILE)
}

export async function saveRequestQuotation(body: Partial<RFQItem>) {
  if (!body?.customer?.trim()) throw createError({ statusCode: 400, statusMessage: 'Customer is required' })
  const records = readSalesData<RFQItem>(FILE)
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  const status = body.status || 'Pending'
  if (!['Ordered', 'Complete', 'Pending', 'Received', 'Unavailable'].includes(status))
    throw createError({ statusCode: 400, statusMessage: 'Invalid request status' })
  if (body.document && (!Array.isArray(body.document.items) || !body.document.items.length || body.document.items.some((item) =>
    !item.description?.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0,
  ))) throw createError({ statusCode: 400, statusMessage: 'Add at least one valid request item' })
  const previous = index >= 0 ? records[index] : undefined
  const next = Math.max(0, ...records.map((item) => Number(item.noRequest.replace(/\D/g, '')) || 0)) + 1
  const record: RFQItem = {
    ...previous,
    id: previous?.id || randomUUID(),
    noRequest: previous?.noRequest || `RFQ${String(next).padStart(5, '0')}`,
    customer: body.customer.trim(),
    email: body.email?.trim() || '',
    telp: body.telp?.trim() || '',
    date: body.date || new Date().toISOString().slice(0, 10),
    status,
    document: body.document ?? previous?.document,
  }
  if (record.document) record.document = {
    ...record.document,
    rfqNo: record.noRequest,
    to: record.customer,
    email: record.email,
    telp: record.telp,
    date: record.date,
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  await writeJSON(FILE, records)
  return record
}

export async function deleteRequestQuotation(id: string) {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Request quotation ID is required' })
  const records = readSalesData<RFQItem>(FILE)
  const remaining = records.filter((item) => item.id !== id && item.noRequest !== id)
  if (remaining.length === records.length)
    throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  await writeJSON(FILE, remaining)
  return { id }
}
