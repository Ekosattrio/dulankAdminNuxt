import { defineEventHandler, readBody } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { Purchase } from '~/types/purchase'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Purchase>>(event)
  const purchases = readData<Purchase>('purchases.json')

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Calculate items, product summary, amount, tax, due
  const items = body.items || []
  const subTotal = items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
  const shippingCost = Number(body.shippingCost || 0)
  const tax = Math.round(subTotal * 0.11)
  const totalAmount = body.amount ?? (subTotal + tax + shippingCost)
  const paid = Number(body.paid || 0)
  const due = Math.max(0, totalAmount - paid)

  const productSummary = body.product || items.map(i => i.name).join(', ')

  let paymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Refunded' = body.paymentStatus || 'Unpaid'
  if (paid >= totalAmount && totalAmount > 0) {
    paymentStatus = 'Paid'
  } else if (paid > 0 && paid < totalAmount) {
    paymentStatus = 'Partial'
  } else if (paid === 0) {
    paymentStatus = 'Unpaid'
  }

  if (body.id) {
    const index = purchases.findIndex((p) => String(p.id) === String(body.id) || String(p.noPurchase) === String(body.noPurchase))
    if (index !== -1) {
      const current = purchases[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Purchase not found' })
      const updated: Purchase = {
        ...current,
        ...body,
        items,
        product: productSummary || current.product,
        amount: totalAmount,
        paid,
        due,
        shippingCost,
        tax,
        paymentStatus,
      }
      purchases[index] = updated
      writeData('purchases.json', purchases)
      return {
        success: true,
        data: updated,
        message: 'Purchase updated successfully'
      }
    }
  }

  const nextNum = purchases.length + 1
  const nextNoPurchase = body.noPurchase || `PR-2512${String(nextNum).padStart(6, '0')}`

  const newPurchase: Purchase = {
    id: body.id || nextNoPurchase,
    noPurchase: nextNoPurchase,
    date: body.date || dateFormatted,
    created: body.created || 'Admin',
    supplier: body.supplier || 'PT Kertas Jaya',
    product: productSummary || 'Bahan Baku Cetak',
    status: body.status || 'Ordered',
    amount: totalAmount,
    paid,
    due,
    paymentStatus,
    notes: body.notes || '',
    shippingCost,
    tax,
    items,
  }

  purchases.unshift(newPurchase)
  writeData('purchases.json', purchases)

  return {
    success: true,
    data: newPurchase,
    message: 'Purchase created successfully'
  }
})
