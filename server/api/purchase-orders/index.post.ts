import { defineEventHandler, readBody } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseOrder } from '~/types/purchase-order'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PurchaseOrder>>(event)
  const orders = readData<PurchaseOrder>('purchase-orders.json')

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const items = body.items || []
  const subTotal = items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
  const taxRate = typeof body.taxRate !== 'undefined' ? Number(body.taxRate) : 0.11
  const taxAmount = Math.round(subTotal * taxRate)
  const totalAmount = typeof body.amount !== 'undefined' ? Number(body.amount) : (subTotal + taxAmount)

  if (body.id) {
    const index = orders.findIndex((p) => String(p.id) === String(body.id) || String(p.noPO) === String(body.noPO))
    if (index !== -1) {
      const current = orders[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Purchase order not found' })
      const updated: PurchaseOrder = {
        ...current,
        ...body,
        items,
        amount: totalAmount,
        poStatus: body.poStatus || current.poStatus || 'Sent',
        goodsStatus: body.goodsStatus || current.goodsStatus || 'Pending',
      }
      orders[index] = updated
      writeData('purchase-orders.json', orders)
      return {
        success: true,
        data: updated,
        message: 'Purchase Order updated successfully'
      }
    }
  }

  const nextNum = orders.length + 1
  const generatedNo = `PO-${String(nextNum).padStart(6, '0')}`

  const newOrder: PurchaseOrder = {
    id: `po-${Date.now()}`,
    noPO: body.noPO || generatedNo,
    date: body.date || dateFormatted,
    created: body.created || 'Sales Staff',
    noPurchase: body.noPurchase || `PR-${String(nextNum).padStart(6, '0')}`,
    supplier: body.supplier || 'PT Kertas Jaya',
    amount: totalAmount,
    poStatus: body.poStatus || 'Sent',
    goodsStatus: body.goodsStatus || 'Pending',
    goodsDate: body.goodsDate || '',
    goodsBy: body.goodsBy || '',
    termOfPayment: body.termOfPayment || '30 Days',
    deliveryDate: body.deliveryDate || dateFormatted,
    deliveryAddress: body.deliveryAddress || 'Gudang Percetakan Dulank, Karawang',
    vendorReff: body.vendorReff || '',
    taxRate,
    items
  }

  orders.unshift(newOrder)
  writeData('purchase-orders.json', orders)

  return {
    success: true,
    data: newOrder,
    message: 'Purchase Order created successfully'
  }
})
