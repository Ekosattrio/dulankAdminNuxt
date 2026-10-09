import { randomUUID } from 'node:crypto'
import type { RFQItem } from '#server/types/request-quotation'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<RFQItem>>(event)
  if (!body?.customer?.trim()) throw createError({ statusCode: 400, statusMessage: 'Customer is required' })
  const records = readSalesData<RFQItem>('request-quotations.json')
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0)
    throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  const status = body.status || 'Pending'
  if (!['Ordered', 'Complete', 'Pending', 'Received'].includes(status))
    throw createError({ statusCode: 400, statusMessage: 'Invalid request status' })
  if (
    body.document &&
    (!Array.isArray(body.document.items) ||
      body.document.items.some(
        (item) => !item.description?.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0,
      ))
  )
    throw createError({ statusCode: 400, statusMessage: 'Check item descriptions and quantities' })
  const next = Math.max(0, ...records.map((item) => Number(item.noRequest.replace(/\D/g, '')) || 0)) + 1
  const record: RFQItem = {
    ...(index >= 0 ? records[index] : {}),
    id: body.id || randomUUID(),
    noRequest: index >= 0 ? records[index]!.noRequest : `RFQ${String(next).padStart(5, '0')}`,
    customer: body.customer.trim(),
    email: body.email || '',
    telp: body.telp || '',
    date: body.date || new Date().toISOString().slice(0, 10),
    status,
    document: body.document ?? (index >= 0 ? records[index]?.document : undefined),
  }
  if (record.document)
    record.document = {
      ...record.document,
      rfqNo: record.noRequest,
      to: record.customer,
      email: record.email,
      telp: record.telp,
      date: record.date,
    }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  writeJSON('request-quotations.json', records)
  return createResponse(record)
})
