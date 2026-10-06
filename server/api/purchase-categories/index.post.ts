import { defineEventHandler, readBody } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseCategory } from '~/types/purchase-category'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PurchaseCategory>>(event)
  const categories = readData<PurchaseCategory>('purchase-categories.json')

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
    const index = categories.findIndex((c) => String(c.id) === String(body.id))
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        ...body,
        status: body.status || categories[index].status || 'Active',
      }
      writeData('purchase-categories.json', categories)
      return {
        success: true,
        data: categories[index],
        message: 'Purchase category updated successfully'
      }
    }
  }

  const nextNum = categories.length + 1
  const newCat: PurchaseCategory = {
    id: body.id || `CAT-${String(nextNum).padStart(3, '0')}`,
    name: body.name || '',
    created: body.created || formattedCreated,
    status: body.status || 'Active'
  }

  categories.unshift(newCat)
  writeData('purchase-categories.json', categories)

  return {
    success: true,
    data: newCat,
    message: 'Purchase category created successfully'
  }
})
