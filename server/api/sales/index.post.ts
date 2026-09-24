import type { Sale, SaleFormData } from '~/types/sale'

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event)

  if (!body || !body.customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required'
    })
  }

  const allSales = await readJSON<Sale[]>('sales.json', [])

  const subTotal = Number(body.subTotal) || 0
  const deliveryFee = Number(body.deliveryFee) || 0
  const discount = Number(body.discount) || 0
  const tax = Number(body.tax) || 0
  const total = subTotal + deliveryFee + tax - discount

  if (body.id) {
    // Update
    const idx = allSales.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      allSales[idx] = {
        ...allSales[idx],
        customer: body.customer,
        subTotal,
        deliveryFee,
        discount,
        tax,
        total,
        delivery: body.delivery || allSales[idx].delivery,
        channel: body.channel || allSales[idx].channel,
        status: body.status || allSales[idx].status,
        method: body.method || allSales[idx].method
      }
      await writeJSON('sales.json', allSales)
      return createResponse(allSales[idx], 'Sale updated successfully')
    }
  }

  // Create
  const nextNum = String(allSales.length + 1).padStart(3, '0')
  const saleNo = body.saleNo || `PT${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newSale: Sale = {
    id: String(Date.now()),
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
    method: body.method || 'Cash'
  }

  allSales.unshift(newSale)
  await writeJSON('sales.json', allSales)

  return createResponse(newSale, 'Sale created successfully')
})

