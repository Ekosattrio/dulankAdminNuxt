import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import type { Sale, SaleFormData } from '~/types/sale'
import { writeJSON } from './data'
import { readSalesData } from './salesData'
import { salesVoucherDiscount } from './salesVoucher'

export interface SaveSaleResult {
  sale: Sale
  message: string
}

function calculateSaleAmounts(body: SaleFormData, allSales: Sale[]) {
  const submittedItems = Array.isArray(body.items) ? body.items : undefined
  const subTotal = submittedItems?.length
    ? submittedItems.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0)
    : Number(body.subTotal) || 0
  const deliveryFee = Number(body.deliveryFee) || 0
  const previous = body.id ? allSales.find((sale) => sale.id === body.id) : undefined
  const voucherCode = body.document?.voucher?.trim() || ''
  let voucherDiscount = 0

  if (voucherCode) {
    const voucherUnchanged =
      previous?.document?.voucher === voucherCode &&
      previous.subTotal === subTotal &&
      typeof previous.voucherDiscount === 'number'
    voucherDiscount = voucherUnchanged
      ? previous.voucherDiscount || 0
      : salesVoucherDiscount(voucherCode, subTotal, body.customer, body.id)
  }

  const directDiscount =
    Number(
      body.directDiscount ??
        (body.voucherDiscount === undefined ? body.discount : Number(body.discount) - voucherDiscount),
    ) || 0
  const discount = voucherDiscount + directDiscount
  const totalBeforeTax = Math.max(0, subTotal + deliveryFee - discount)
  const taxRate = Number(body.document?.taxRate)
  const tax = Number.isFinite(taxRate)
    ? Math.round((totalBeforeTax * taxRate) / 100)
    : Number(body.tax) || 0

  if (
    ![subTotal, deliveryFee, voucherDiscount, directDiscount, discount, tax].every(
      (value) => Number.isFinite(value) && value >= 0,
    ) ||
    discount > subTotal + deliveryFee
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid sale amounts' })
  }

  return {
    subTotal,
    deliveryFee,
    voucherDiscount,
    directDiscount,
    discount,
    tax,
    total: totalBeforeTax + tax,
  }
}

function validateSaleItems(body: SaleFormData) {
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
}

export function saveSale(body: SaleFormData): SaveSaleResult {
  if (!body?.customer) {
    throw createError({ statusCode: 400, statusMessage: 'Customer name is required' })
  }

  const allSales = readSalesData<Sale>('sales.json')
  validateSaleItems(body)
  const amounts = calculateSaleAmounts(body, allSales)

  if (body.id) {
    const index = allSales.findIndex((sale) => sale.id === body.id)
    if (index === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Record not found' })
    }

    const previous = allSales[index]!
    const updated: Sale = {
      ...previous,
      customer: body.customer,
      ...amounts,
      transactionCode: body.document?.transactionCode || body.transactionCode,
      delivery: body.delivery || previous.delivery,
      channel: body.channel || previous.channel,
      status: body.status || previous.status,
      method: body.method || previous.method,
      items: body.items ?? previous.items,
      document: body.document ?? previous.document,
    }
    allSales[index] = updated
    writeJSON('sales.json', allSales)
    return { sale: updated, message: 'Sale updated successfully' }
  }

  const nextNumber = String(
    Math.max(0, ...allSales.map((item) => Number(item.saleNo.replace(/\D/g, '')) || 0)) + 1,
  ).padStart(3, '0')
  const now = new Date()
  const newSale: Sale = {
    id: randomUUID(),
    saleNo: body.saleNo || `PT${nextNumber}`,
    customer: body.customer,
    date: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
    ...amounts,
    delivery: body.delivery || 'Shipping',
    channel: body.channel || 'POS',
    status: body.status || 'Paid',
    method: body.method || 'Cash',
    transactionCode: body.document?.transactionCode || body.transactionCode,
    items: body.items,
    document: body.document,
  }

  allSales.unshift(newSale)
  writeJSON('sales.json', allSales)
  return { sale: newSale, message: 'Sale created successfully' }
}
