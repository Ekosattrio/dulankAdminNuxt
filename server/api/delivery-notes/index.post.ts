import { randomUUID } from 'node:crypto'
import type { DeliveryNote, DeliveryNoteFormData } from '~/types/delivery-note'

export default defineEventHandler(async (event) => {
  const body = await readBody<DeliveryNoteFormData>(event)

  if (!body || !body.customer || !body.noSales) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer and Sales Order No are required',
    })
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
    // Update
    const idx = allNotes.findIndex((n) => n.id === body.id)
    if (idx !== -1) {
      const previous = allNotes[idx]!
      allNotes[idx] = {
        ...previous,
        customer: body.customer,
        noSales: body.noSales,
        shippingAddress: body.shippingAddress ?? previous.shippingAddress,
        status: body.status || previous.status,
        po: body.po ?? previous.po,
        shippingBy: body.shippingBy ?? previous.shippingBy,
        reference: body.reference ?? previous.reference,
        items: body.items || previous.items,
        date: date || previous.date,
        dateStatus:
          body.status && body.status !== previous.status
            ? new Date().toLocaleDateString('en-GB')
            : previous.dateStatus,
        receiveBy: body.receiveBy ?? previous.receiveBy,
        security: body.security ?? previous.security,
        driver: body.driver ?? previous.driver,
        issuedBy: body.issuedBy ?? previous.issuedBy,
      }
      await writeJSON('delivery-notes.json', allNotes)
      return createResponse(allNotes[idx], 'Delivery note updated successfully')
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  // Create
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
  await writeJSON('delivery-notes.json', allNotes)

  return createResponse(newNote, 'Delivery note created successfully')
})
