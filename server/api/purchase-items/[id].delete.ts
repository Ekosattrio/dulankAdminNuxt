import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseItem } from '~/types/purchase-item'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<PurchaseItem>('purchase-items.json')

  const updated = items.filter((i) => String(i.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Purchase item not found'
    })
  }

  writeData('purchase-items.json', updated)

  return {
    success: true,
    data: { id }
  }
})
