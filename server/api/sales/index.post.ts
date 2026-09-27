import { randomUUID } from 'node:crypto'
import type { Sale, SaleFormData } from '~/types/sale'

export default defineEventHandler(async (event) => {
  const body = await readBody<SaleFormData>(event)

  if (!body || !body.customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required',
    })
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
    // Update
    const idx = allSales.findIndex((s) => s.id === body.id)
    if (idx !== -1) {
      const previous = allSales[idx]!
      allSales[idx] = {
        ...previous,
        customer: body.customer,
        subTotal,
        deliveryFee,
        discount,
        tax,
        total,
        delivery: body.delivery || previous.delivery,
        channel: body.channel || previous.channel,
        status: body.status || previous.status,
        method: body.method || previous.method,
        items: body.items ?? previous.items,
        document: body.document ?? previous.document,
      }
      await writeJSON('sales.json', allSales)
      return createResponse(allSales[idx], 'Sale updated successfully')
    }
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }

  // Create
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
  await writeJSON('sales.json', allSales)

  return createResponse(newSale, 'Sale created successfully')
})
