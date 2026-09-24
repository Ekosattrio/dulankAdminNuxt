import type { DeliveryNote, DeliveryNoteFormData } from '~/types/delivery-note'

export default defineEventHandler(async (event) => {
  const body = await readBody<DeliveryNoteFormData>(event)

  if (!body || !body.customer || !body.noSales) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer and Sales Order No are required'
    })
  }

  const allNotes = await readJSON<DeliveryNote[]>('delivery-notes.json', [])

  if (body.id) {
    // Update
    const idx = allNotes.findIndex(n => n.id === body.id)
    if (idx !== -1) {
      allNotes[idx] = {
        ...allNotes[idx],
        customer: body.customer,
        noSales: body.noSales,
        shippingAddress: body.shippingAddress || allNotes[idx].shippingAddress,
        status: body.status || allNotes[idx].status,
        po: body.po || allNotes[idx].po,
        shippingBy: body.shippingBy || allNotes[idx].shippingBy,
        reference: body.reference || allNotes[idx].reference,
        items: body.items || allNotes[idx].items
      }
      await writeJSON('delivery-notes.json', allNotes)
      return createResponse(allNotes[idx], 'Delivery note updated successfully')
    }
  }

  // Create
  const nextNum = String(allNotes.length + 1).padStart(4, '0')
  const dnNo = body.dnNo || `DN${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newNote: DeliveryNote = {
    id: String(Date.now()),
    dnNo,
    date: dateStr,
    customer: body.customer,
    noSales: body.noSales,
    shippingAddress: body.shippingAddress || '',
    status: body.status || 'Pending',
    dateStatus: dateStr,
    po: body.po || `PO-${Date.now().toString().slice(-6)}`,
    shippingBy: body.shippingBy || 'Motorcycle',
    reference: body.reference || 'Admin',
    items: body.items || [
      {
        description: 'Standard Delivery Package',
        qty: 1,
        unit: 'Piece',
        packingQty: '1 Box',
        weight: '1 Kg'
      }
    ]
  }

  allNotes.unshift(newNote)
  await writeJSON('delivery-notes.json', allNotes)

  return createResponse(newNote, 'Delivery note created successfully')
})

