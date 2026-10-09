import { defineEventHandler, readBody } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseReturn } from '~/types/purchase-return'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PurchaseReturn>>(event)
  const returns = readData<PurchaseReturn>('purchase-returns.json')

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const items = body.items || []
  const calculatedAmount = items.reduce((sum, item) => sum + (Number(item.amount) || (Number(item.returnQty || 0) * Number(item.price || 0))), 0)
  const totalAmount = body.amount ?? calculatedAmount
  const paid = Number(body.paid || 0)
  const due = Math.max(0, totalAmount - paid)

  let status: 'Refunded' | 'Cancel' | 'Ordered' | 'Received' | 'Pending' = body.status || 'Pending'
  if (paid >= totalAmount && totalAmount > 0) {
    status = 'Refunded'
  }

  if (body.id) {
    const index = returns.findIndex((r) => String(r.id) === String(body.id) || String(r.noPR) === String(body.noPR))
    if (index !== -1) {
      returns[index] = {
        ...returns[index],
        ...body,
        items,
        amount: totalAmount,
        paid,
        due,
        status,
      } as PurchaseReturn
      writeData('purchase-returns.json', returns)
      return {
        success: true,
        data: returns[index],
        message: 'Purchase Return updated successfully'
      }
    }
  }

  const nextNum = returns.length + 11
  const generatedNo = `PRT-${String(nextNum).padStart(4, '0')}`

  const newReturn: PurchaseReturn = {
    id: `pr-${Date.now()}`,
    noPR: body.noPR || generatedNo,
    date: body.date || dateFormatted,
    created: body.created || 'Sales Staff',
    noPurchase: body.noPurchase || `PR-00000${nextNum}`,
    supplier: body.supplier || 'PT Kertas Jaya',
    amount: totalAmount,
    paid,
    due,
    status,
    statusBy: body.statusBy || 'Admin',
    notes: body.notes || '',
    items
  }

  returns.unshift(newReturn)
  writeData('purchase-returns.json', returns)

  return {
    success: true,
    data: newReturn,
    message: 'Purchase Return created successfully'
  }
})
