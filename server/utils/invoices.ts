import { randomUUID } from 'node:crypto'
import type { Invoice, InvoiceFilterParams, InvoiceFormData } from '#server/types/invoice'

const FILE = 'invoices.json'

export function listInvoices(filters: InvoiceFilterParams = {}) {
  const search = filters.search?.toLowerCase().trim() || ''
  return readSalesData<Invoice>(FILE).filter((item) => {
    const matchesSearch = !search || item.invoiceNo.toLowerCase().includes(search) || item.customer.toLowerCase().includes(search)
    const matchesStatus = !filters.status || filters.status === 'All' || item.status === filters.status
    return matchesSearch && matchesStatus
  })
}

export async function saveInvoice(body: InvoiceFormData) {
  if (!body?.customer?.trim())
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  const records = readSalesData<Invoice>(FILE)
  const amount = Number(body.amount)
  const paid = Number(body.paid)
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(paid) || paid < 0)
    throw createError({ statusCode: 400, statusMessage: 'Invoice amounts must be valid non-negative numbers' })
  const amountDue = Math.max(0, amount - paid)
  const calculatedStatus: Invoice['status'] = amount > 0 && paid >= amount ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  const previous = index >= 0 ? records[index] : undefined
  const next = Math.max(0, ...records.map((item) => Number(item.invoiceNo.replace(/\D/g, '')) || 0)) + 1
  const due = new Date()
  due.setDate(due.getDate() + 30)
  const fallbackDue = due.toLocaleDateString('en-GB')
  const record: Invoice = {
    id: previous?.id || randomUUID(),
    invoiceNo: previous?.invoiceNo || body.invoiceNo || `INV${String(next).padStart(5, '0')}`,
    customer: body.customer.trim(),
    dueDate: body.dueDate || previous?.dueDate || fallbackDue,
    amount,
    paid,
    amountDue,
    status: calculatedStatus,
  }
  if (index >= 0) records[index] = record
  else records.unshift(record)
  await writeJSON(FILE, records)
  return record
}

export async function deleteInvoice(id: string) {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invoice ID is required' })
  const records = readSalesData<Invoice>(FILE)
  const remaining = records.filter((item) => item.id !== id && item.invoiceNo !== id)
  if (remaining.length === records.length) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  await writeJSON(FILE, remaining)
  return { id }
}
