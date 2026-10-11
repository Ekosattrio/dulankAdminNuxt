import { randomUUID } from 'node:crypto'
import type { DeliveryNote, DeliveryNoteFilterParams, DeliveryNoteFormData } from '#server/types/delivery-note'

const FILE = 'delivery-notes.json'
const today = () => new Date().toLocaleDateString('en-GB')
const normalizeDate = (value?: string) =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value

export function listDeliveryNotes(filters: DeliveryNoteFilterParams = {}) {
  const search = filters.search?.toLowerCase().trim() || ''
  return readSalesData<DeliveryNote>(FILE).filter((item) => {
    const haystack = [item.dnNo, item.customer, item.noSales, item.shippingAddress].join(' ').toLowerCase()
    return (!search || haystack.includes(search)) && (!filters.status || filters.status === 'All' || item.status === filters.status)
  })
}

export async function saveDeliveryNote(body: DeliveryNoteFormData) {
  if (!body?.customer?.trim() || !body.noSales?.trim())
    throw createError({ statusCode: 400, statusMessage: 'Customer and Sales Order No are required' })
  if (!Array.isArray(body.items) || !body.items.length || body.items.some((item) =>
    !item.description?.trim() || !Number.isFinite(item.qty) || item.qty <= 0,
  )) throw createError({ statusCode: 400, statusMessage: 'Add at least one valid delivery item' })
  if (!['Complete', 'Pending', 'Ordered', 'Received', 'Rescheduled'].includes(body.status))
    throw createError({ statusCode: 400, statusMessage: 'Invalid delivery status' })
  const records = readSalesData<DeliveryNote>(FILE)
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Delivery note not found' })
  const previous = index >= 0 ? records[index] : undefined
  const next = Math.max(0, ...records.map((item) => Number(item.dnNo.replace(/\D/g, '')) || 0)) + 1
  const record: DeliveryNote = {
    id: previous?.id || randomUUID(),
    dnNo: previous?.dnNo || body.dnNo || `DN${String(next).padStart(4, '0')}`,
    date: normalizeDate(body.date) || previous?.date || today(),
    customer: body.customer.trim(),
    noSales: body.noSales.trim(),
    shippingAddress: body.shippingAddress?.trim() || '',
    status: body.status || previous?.status || 'Pending',
    dateStatus: body.status && body.status !== previous?.status ? today() : previous?.dateStatus || today(),
    po: body.po?.trim() || '',
    shippingBy: body.shippingBy?.trim() || '',
    reference: body.reference?.trim() || '',
    items: body.items.map((item) => ({ ...item, description: item.description.trim() })),
    receiveBy: body.receiveBy?.trim(),
    security: body.security?.trim(),
    driver: body.driver?.trim(),
    issuedBy: body.issuedBy?.trim(),
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  await writeJSON(FILE, records)
  return record
}

export async function deleteDeliveryNote(id: string) {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Delivery Note ID is required' })
  const records = readSalesData<DeliveryNote>(FILE)
  const remaining = records.filter((item) => item.id !== id && item.dnNo !== id)
  if (remaining.length === records.length) throw createError({ statusCode: 404, statusMessage: 'Delivery note not found' })
  await writeJSON(FILE, remaining)
  return { id }
}
