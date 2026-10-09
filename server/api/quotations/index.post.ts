import { randomUUID } from 'node:crypto'
import type { Quotation, QuotationFormData } from '~/types/quotation'

export default defineEventHandler(async (event) => {
  const body = await readBody<QuotationFormData>(event)

  if (!body || !body.customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required',
    })
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
      throw createError({
        statusCode: 400,
        statusMessage: 'Check quotation products, quantities and charges',
      })
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
  if (!Number.isFinite(total) || total < 0)
    throw createError({ statusCode: 400, statusMessage: 'Invalid quotation amount' })

  if (body.id) {
    // Update
    const idx = allQuotations.findIndex((q) => q.id === body.id)
    if (idx !== -1) {
      const previous = allQuotations[idx]!
      allQuotations[idx] = {
        ...previous,
        customer: body.customer,
        email: body.email,
        status: body.status || 'Send',
        total,
        channel: body.channel || 'Online',
        dueDate: body.dueDate || previous.dueDate,
        document: document ?? previous.document,
        date: document?.date ? document.date.split('-').reverse().join('/') : previous.date,
      }
      await writeJSON('quotations.json', allQuotations)
      return createResponse(allQuotations[idx], 'Quotation updated successfully')
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  // Create
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
  await writeJSON('quotations.json', allQuotations)

  return createResponse(newQuotation, 'Quotation created successfully')
})
