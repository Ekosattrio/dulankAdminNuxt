import sales from '../data/sales.json'
import invoices from '../data/invoices.json'
import deliveryNotes from '../data/delivery-notes.json'
import quotations from '../data/quotations.json'
import salesReturns from '../data/sales-returns.json'
import requestQuotations from '../data/request-quotations.json'
import posProducts from '../data/pos-products.json'
import salesHistory from '../data/sales-history.json'
import salesVouchers from '../data/sales-vouchers.json'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeJSON } from './data'
import { salesVoucherDiscount } from './salesVoucher'
import type { Sale, SaleFormData } from '#server/types/sale'
import type { SalesPayment, SalesHistoryEntry } from '#server/types/sales-document'
import type { Invoice, InvoiceFormData } from '#server/types/invoice'
import type { DeliveryNote, DeliveryNoteFormData } from '#server/types/delivery-note'
import type { Quotation, QuotationFormData } from '#server/types/quotation'
import type { RFQItem } from '#server/types/request-quotation'
import type { SalesReturn, SalesReturnFormData, ReturnPayment } from '#server/types/sales-return'

const sources = {
  'sales.json': sales,
  'invoices.json': invoices,
  'delivery-notes.json': deliveryNotes,
  'quotations.json': quotations,
  'sales-returns.json': salesReturns,
  'request-quotations.json': requestQuotations,
  'pos-products.json': posProducts,
  'sales-history.json': salesHistory,
  'sales-vouchers.json': salesVouchers,
}

/** Existing runtime data, including [], always takes precedence over the source JSON. */
export function readSalesData<T>(filename: keyof typeof sources): T[] {
  const file = resolve(process.cwd(), 'data', filename)
  if (!existsSync(file)) return structuredClone(sources[filename]) as T[]
  try {
    const records: unknown = JSON.parse(readFileSync(file, 'utf8'))
    if (!Array.isArray(records)) throw new Error('Expected an array')
    return records as T[]
  } catch {
    // Never replace damaged runtime data with the source records during a save.
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to read ${filename}; existing data was preserved`,
    })
  }
}

export function writeSalesData<T>(filename: keyof typeof sources, data: T[]): void {
  writeJSON(filename, data)
}

// ----------------- Sales -----------------

export async function saveSaleDomain(body: SaleFormData): Promise<{ sale: Sale; isNew: boolean }> {
  if (!body || !body.customer) {
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  }

  const allSales = readSalesData<Sale>('sales.json')
  const subTotal = Number(body.subTotal) || 0
  const deliveryFee = Number(body.deliveryFee) || 0
  let discount = Number(body.discount) || 0
  const tax = Number(body.tax) || 0

  const previous = body.id ? allSales.find((sale) => sale.id === body.id) : undefined
  if (
    body.document?.voucher?.trim() &&
    (body.document.voucher !== previous?.document?.voucher ||
      subTotal !== previous?.subTotal ||
      discount !== previous?.discount)
  ) {
    discount = salesVoucherDiscount(body.document.voucher, subTotal, body.customer, body.id)
  }
  const total = subTotal + deliveryFee + tax - discount

  if (
    ![subTotal, deliveryFee, discount, tax].every((value) => Number.isFinite(value) && value >= 0) ||
    discount > subTotal
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid sale amounts' })
  }
  if (
    body.items &&
    (!Array.isArray(body.items) ||
      body.items.some(
        (item) =>
          !item.name ||
          !Number.isInteger(item.qty) ||
          item.qty <= 0 ||
          !Number.isFinite(item.price) ||
          item.price < 0,
      ))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid sale items' })
  }

  if (body.id) {
    const idx = allSales.findIndex((s) => s.id === body.id)
    if (idx !== -1) {
      const prev = allSales[idx]!
      allSales[idx] = {
        ...prev,
        customer: body.customer,
        subTotal,
        deliveryFee,
        discount,
        tax,
        total,
        delivery: body.delivery || prev.delivery,
        channel: body.channel || prev.channel,
        status: body.status || prev.status,
        method: body.method || prev.method,
        items: body.items ?? prev.items,
        document: body.document ?? prev.document,
      }
      writeSalesData('sales.json', allSales)
      return { sale: allSales[idx]!, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  const nextNum = String(
    Math.max(0, ...allSales.map((item) => Number(item.saleNo.replace(/\D/g, '')) || 0)) + 1,
  ).padStart(3, '0')
  const saleNo = body.saleNo || `PT${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newSale: Sale = {
    id: randomUUID(),
    saleNo,
    customer: body.customer,
    date: dateStr,
    subTotal,
    deliveryFee,
    discount,
    tax,
    total,
    delivery: body.delivery || 'Shipping',
    channel: body.channel || 'POS',
    status: body.status || 'Paid',
    method: body.method || 'Cash',
    items: body.items,
    document: body.document,
  }

  allSales.unshift(newSale)
  writeSalesData('sales.json', allSales)
  return { sale: newSale, isNew: true }
}

export async function recordSalePaymentDomain(saleId: string, body: Partial<SalesPayment>): Promise<Sale> {
  const records = readSalesData<Sale>('sales.json')
  const sale = records.find((s) => s.id === saleId)
  if (!sale) throw createError({ statusCode: 404, statusMessage: 'Sale not found' })

  const paid = sale.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  if (sale.status === 'Paid') throw createError({ statusCode: 409, statusMessage: 'Sale is already paid' })

  if (!Number.isFinite(body.amount) || Number(body.amount) <= 0 || Number(body.amount) > sale.total - paid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment must be greater than zero and no more than the amount due',
    })
  }

  if (!['Cash', 'Bank Transfer', 'Debit Card'].includes(body.method || '')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payment method' })
  }

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
  writeSalesData('sales.json', records)
  return sale
}

export async function deleteSaleDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Sale ID is required' })

  const allSales = readSalesData<Sale>('sales.json')
  const newSales = allSales.filter((s) => s.id !== id && s.saleNo !== id)

  if (allSales.length === newSales.length) {
    throw createError({ statusCode: 404, statusMessage: 'Sale record not found' })
  }

  const record = allSales.find((s) => s.id === id || s.saleNo === id)!
  const history = readSalesData<SalesHistoryEntry>('sales-history.json')
  history.unshift({
    id: randomUUID(),
    saleId: record.id,
    saleNo: record.saleNo,
    customer: record.customer,
    date: new Date().toLocaleDateString('en-GB'),
    total: record.total,
    created: 'Admin',
    kind: 'deleted',
  })

  writeSalesData('sales-history.json', history)
  writeSalesData('sales.json', newSales)
  return { id }
}

// ----------------- Invoices -----------------

export async function saveInvoiceDomain(body: InvoiceFormData): Promise<{ invoice: Invoice; isNew: boolean }> {
  if (!body || !body.customer) {
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  }

  const allInvoices = readSalesData<Invoice>('invoices.json')
  const amount = Number(body.amount) || 0
  const paid = Number(body.paid) || 0
  const amountDue = Math.max(0, amount - paid)

  let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid'
  if (paid >= amount && amount > 0) {
    status = 'Paid'
  } else if (paid > 0) {
    status = 'Partial'
  }

  if (body.id) {
    const idx = allInvoices.findIndex((i) => i.id === body.id)
    if (idx !== -1) {
      const prev = allInvoices[idx]!
      allInvoices[idx] = {
        ...prev,
        customer: body.customer,
        dueDate: body.dueDate || prev.dueDate,
        amount,
        paid,
        amountDue,
        status: (body.status as any) || status,
      }
      writeSalesData('invoices.json', allInvoices)
      return { invoice: allInvoices[idx]!, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  const nextNum = String(
    Math.max(0, ...allInvoices.map((item) => Number(item.invoiceNo.replace(/\D/g, '')) || 0)) + 1,
  ).padStart(5, '0')
  const invoiceNo = body.invoiceNo || `INV${nextNum}`
  const due = new Date()
  due.setDate(due.getDate() + 30)
  const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

  const newInvoice: Invoice = {
    id: randomUUID(),
    invoiceNo,
    customer: body.customer,
    dueDate: body.dueDate || dueStr,
    amount,
    paid,
    amountDue,
    status: (body.status as any) || status,
  }

  allInvoices.unshift(newInvoice)
  writeSalesData('invoices.json', allInvoices)
  return { invoice: newInvoice, isNew: true }
}

export async function deleteInvoiceDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invoice ID is required' })

  const allInvoices = readSalesData<Invoice>('invoices.json')
  const newInvoices = allInvoices.filter((i) => i.id !== id && i.invoiceNo !== id)

  if (allInvoices.length === newInvoices.length) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  writeSalesData('invoices.json', newInvoices)
  return { id }
}

// ----------------- Delivery Notes -----------------

export async function saveDeliveryNoteDomain(body: DeliveryNoteFormData): Promise<{ note: DeliveryNote; isNew: boolean }> {
  if (!body || !body.customer || !body.noSales) {
    throw createError({ statusCode: 400, statusMessage: 'Customer and Sales Order No are required' })
  }

  const allNotes = readSalesData<DeliveryNote>('delivery-notes.json')

  if (
    body.items &&
    (!Array.isArray(body.items) ||
      body.items.some((item) => !item.description?.trim() || !Number.isFinite(item.qty) || item.qty <= 0))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Check item descriptions and quantities' })
  }

  const date = body.date
    ? /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date.split('-').reverse().join('/')
      : body.date
    : undefined

  if (body.id) {
    const idx = allNotes.findIndex((n) => n.id === body.id)
    if (idx !== -1) {
      const prev = allNotes[idx]!
      allNotes[idx] = {
        ...prev,
        customer: body.customer,
        noSales: body.noSales,
        shippingAddress: body.shippingAddress ?? prev.shippingAddress,
        status: body.status || prev.status,
        po: body.po ?? prev.po,
        shippingBy: body.shippingBy ?? prev.shippingBy,
        reference: body.reference ?? prev.reference,
        items: body.items || prev.items,
        date: date || prev.date,
        dateStatus:
          body.status && body.status !== prev.status
            ? new Date().toLocaleDateString('en-GB')
            : prev.dateStatus,
        receiveBy: body.receiveBy ?? prev.receiveBy,
        security: body.security ?? prev.security,
        driver: body.driver ?? prev.driver,
        issuedBy: body.issuedBy ?? prev.issuedBy,
      }
      writeSalesData('delivery-notes.json', allNotes)
      return { note: allNotes[idx]!, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  const nextNum = String(
    Math.max(0, ...allNotes.map((item) => Number(item.dnNo.replace(/\D/g, '')) || 0)) + 1,
  ).padStart(4, '0')
  const dnNo = body.dnNo || `DN${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newNote: DeliveryNote = {
    id: randomUUID(),
    dnNo,
    date: date || dateStr,
    customer: body.customer,
    noSales: body.noSales,
    shippingAddress: body.shippingAddress || '',
    status: body.status || 'Pending',
    dateStatus: dateStr,
    po: body.po || `PO-${Date.now().toString().slice(-6)}`,
    shippingBy: body.shippingBy || 'Motorcycle',
    reference: body.reference || 'Admin',
    receiveBy: body.receiveBy,
    security: body.security,
    driver: body.driver,
    issuedBy: body.issuedBy,
    items: body.items || [
      {
        description: 'Standard Delivery Package',
        qty: 1,
        unit: 'Piece',
        packingQty: '1 Box',
        weight: '1 Kg',
      },
    ],
  }

  allNotes.unshift(newNote)
  writeSalesData('delivery-notes.json', allNotes)
  return { note: newNote, isNew: true }
}

export async function deleteDeliveryNoteDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Delivery Note ID is required' })

  const allNotes = readSalesData<DeliveryNote>('delivery-notes.json')
  const newNotes = allNotes.filter((n) => n.id !== id && n.dnNo !== id)

  if (allNotes.length === newNotes.length) {
    throw createError({ statusCode: 404, statusMessage: 'Delivery note not found' })
  }

  writeSalesData('delivery-notes.json', newNotes)
  return { id }
}

// ----------------- Quotations -----------------

export async function saveQuotationDomain(body: QuotationFormData): Promise<{ quotation: Quotation; isNew: boolean }> {
  if (!body || !body.customer) {
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  }

  const allQuotations = readSalesData<Quotation>('quotations.json')
  const document = body.document
  let total = Number(body.total) || 0

  if (document) {
    if (
      !Array.isArray(document.items) ||
      document.items.some(
        (item) =>
          !item.productName?.trim() ||
          !Number.isFinite(item.order) ||
          item.order <= 0 ||
          !Number.isFinite(item.moq) ||
          item.moq <= 0 ||
          item.order < item.moq ||
          !Number.isFinite(item.unitPrice) ||
          item.unitPrice < 0,
      ) ||
      !Number.isFinite(document.shippingCost) ||
      document.shippingCost < 0 ||
      !Number.isFinite(document.taxRate) ||
      document.taxRate < 0 ||
      document.taxRate > 100
    ) {
      throw createError({ statusCode: 400, statusMessage: 'Check quotation products, quantities and charges' })
    }

    if (document.items.length) {
      document.items = document.items.map((item) => ({ ...item, amount: item.order * item.unitPrice }))
      const base = document.items.reduce((sum, item) => sum + item.amount, 0) + document.shippingCost
      total = base + (document.pricesIncludeTax ? 0 : Math.round((base * document.taxRate) / 100))
      delete document.legacyTotal
    } else if (body.id) {
      const existing = allQuotations.find((q) => q.id === body.id)
      total = existing?.total ?? total
      document.legacyTotal = total
    } else {
      throw createError({ statusCode: 400, statusMessage: 'Add at least one product' })
    }
  }

  if (!Number.isFinite(total) || total < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid quotation amount' })
  }

  if (body.id) {
    const idx = allQuotations.findIndex((q) => q.id === body.id)
    if (idx !== -1) {
      const prev = allQuotations[idx]!
      allQuotations[idx] = {
        ...prev,
        customer: body.customer,
        email: body.email,
        status: body.status || 'Send',
        total,
        channel: body.channel || 'Online',
        dueDate: body.dueDate || prev.dueDate,
        document: document ?? prev.document,
        date: document?.date ? document.date.split('-').reverse().join('/') : prev.date,
      }
      writeSalesData('quotations.json', allQuotations)
      return { quotation: allQuotations[idx]!, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  const nextNum = String(
    Math.max(0, ...allQuotations.map((item) => Number(item.noQuotation.replace(/\D/g, '')) || 0)) + 1,
  ).padStart(5, '0')
  const noQuotation = body.noQuotation || `QUO${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newQuotation: Quotation = {
    id: randomUUID(),
    noQuotation,
    date: document?.date ? document.date.split('-').reverse().join('/') : dateStr,
    customer: body.customer,
    email: body.email,
    status: body.status || 'Send',
    dateStatus: dateStr,
    total,
    channel: body.channel || 'Online',
    dueDate: body.dueDate || dateStr,
    document,
  }

  allQuotations.unshift(newQuotation)
  writeSalesData('quotations.json', allQuotations)
  return { quotation: newQuotation, isNew: true }
}

export async function deleteQuotationDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Quotation ID is required' })

  const allQuotations = readSalesData<Quotation>('quotations.json')
  const newQuotations = allQuotations.filter((q) => q.id !== id && q.noQuotation !== id)

  if (allQuotations.length === newQuotations.length) {
    throw createError({ statusCode: 404, statusMessage: 'Quotation not found' })
  }

  writeSalesData('quotations.json', newQuotations)
  return { id }
}

// ----------------- Request for Quotations -----------------

export async function saveRequestQuotationDomain(body: Partial<RFQItem>): Promise<{ rfq: RFQItem; isNew: boolean }> {
  if (!body?.customer?.trim()) throw createError({ statusCode: 400, statusMessage: 'Customer is required' })

  const records = readSalesData<RFQItem>('request-quotations.json')
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) {
    throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  }

  const status = body.status || 'Pending'
  if (!['Ordered', 'Complete', 'Pending', 'Received'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request status' })
  }

  if (
    body.document &&
    (!Array.isArray(body.document.items) ||
      body.document.items.some(
        (item) => !item.description?.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0,
      ))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Check item descriptions and quantities' })
  }

  const next = Math.max(0, ...records.map((item) => Number(item.noRequest.replace(/\D/g, '')) || 0)) + 1
  const isNew = index < 0
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

  if (record.document) {
    record.document = {
      ...record.document,
      rfqNo: record.noRequest,
      to: record.customer,
      email: record.email,
      telp: record.telp,
      date: record.date,
    }
  }

  if (index >= 0) records[index] = record
  else records.unshift(record)

  writeSalesData('request-quotations.json', records)
  return { rfq: record, isNew }
}

export async function deleteRequestQuotationDomain(id: string): Promise<{ id: string }> {
  const records = readSalesData<RFQItem>('request-quotations.json')
  const remaining = records.filter((item) => item.id !== id)
  if (remaining.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: 'Request quotation not found' })
  }
  writeSalesData('request-quotations.json', remaining)
  return { id }
}

// ----------------- Sales Returns -----------------

export async function saveSalesReturnDomain(body: SalesReturnFormData): Promise<{ salesReturn: SalesReturn; isNew: boolean }> {
  if (!body?.customer?.trim() || !body.salesNo?.trim() || !body.date?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Customer, sales number and date are required' })
  }
  if (!Number.isFinite(body.total) || body.total < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid refund amount' })
  }
  if (!['Paid', 'Unpaid'].includes(body.paymentStatus)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payment status' })
  }
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
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Check returned quantities and prices' })
  }

  const records = readSalesData<SalesReturn>('sales-returns.json')
  const index = body.id ? records.findIndex((item) => item.id === body.id) : -1
  if (body.id && index < 0) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })

  const prev = index >= 0 ? records[index] : undefined
  const next = Math.max(0, ...records.map((item) => Number(item.returnNo.replace(/\D/g, '')) || 0)) + 1
  const items = body.items.map((item) => ({ ...item, returnAmount: item.qtyReturn * item.price }))
  const isNew = index < 0

  const record: SalesReturn = {
    ...prev,
    id: prev?.id ?? Math.max(Date.now(), ...records.map((item) => item.id + 1)),
    returnNo: prev?.returnNo ?? `RTN${String(next).padStart(4, '0')}`,
    customer: body.customer.trim(),
    salesNo: body.salesNo.trim(),
    date: body.date,
    paymentStatus: body.paymentStatus,
    paymentDate: body.paymentStatus === 'Paid' ? prev?.paymentDate || body.date : '',
    paymentMethod: body.paymentStatus === 'Paid' ? prev?.paymentMethod || 'Cash' : '',
    total: body.total,
    items,
    notes: body.notes || '',
  }

  if (index >= 0) records[index] = record
  else records.unshift(record)

  writeSalesData('sales-returns.json', records)
  return { salesReturn: record, isNew }
}

export async function recordSalesReturnPaymentDomain(id: number, body: ReturnPayment): Promise<SalesReturn> {
  const records = readSalesData<SalesReturn>('sales-returns.json')
  const record = records.find((item) => item.id === id)
  if (!record) throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  if (record.paymentStatus === 'Paid') {
    throw createError({ statusCode: 409, statusMessage: 'This refund was already recorded' })
  }
  if (
    !body ||
    !['Cash', 'Transfer'].includes(body.method) ||
    !Number.isFinite(body.amount) ||
    body.amount !== record.total
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Payment must match the total refund due' })
  }
  if (
    body.method === 'Transfer' &&
    (!body.bankName?.trim() || !body.accountName?.trim() || !body.accountNumber?.trim())
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Bank and account details are required' })
  }

  record.paymentStatus = 'Paid'
  record.paymentMethod = body.method
  record.paymentDate = new Date().toLocaleDateString('en-GB')
  record.payment = body
  writeSalesData('sales-returns.json', records)
  return record
}

export async function deleteSalesReturnDomain(id: number): Promise<{ id: number }> {
  const records = readSalesData<SalesReturn>('sales-returns.json')
  const remaining = records.filter((item) => item.id !== id)
  if (remaining.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: 'Sales return not found' })
  }
  writeSalesData('sales-returns.json', remaining)
  return { id }
}
