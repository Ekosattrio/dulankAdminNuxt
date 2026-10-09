import { defineEventHandler, readBody } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseItem } from '~/types/purchase-item'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PurchaseItem>>(event)
  const items = readData<PurchaseItem>('purchase-items.json')

  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const formattedCreated = `Admin, ${dateStr}, ${timeStr}`

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Purchase item not found' })
      const updated: PurchaseItem = {
        ...current,
        ...body,
        price: Number(body.price ?? current.price),
      }
      items[index] = updated
      writeData('purchase-items.json', items)
      return {
        success: true,
        data: updated,
        message: 'Purchase item updated successfully'
      }
    }
  }

  const nextNum = items.length + 1
  const newItem: PurchaseItem = {
    id: body.id || `ITEM-${String(nextNum).padStart(3, '0')}`,
    category: body.category || 'Kertas & Bahan Baku Cetak',
    product: body.product || '',
    description: body.description || '',
    merk: body.merk || '',
    price: Number(body.price || 0),
    unit: body.unit || 'Pcs',
    created: body.created || formattedCreated
  }

  items.unshift(newItem)
  writeData('purchase-items.json', items)

  return {
    success: true,
    data: newItem,
    message: 'Purchase item created successfully'
  }
})
