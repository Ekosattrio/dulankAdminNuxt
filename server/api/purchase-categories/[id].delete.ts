import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseCategory } from '~/types/purchase-category'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const categories = readData<PurchaseCategory>('purchase-categories.json')

  const updated = categories.filter((c) => String(c.id) !== String(id))

  if (updated.length === categories.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Purchase category not found'
    })
  }

  writeData('purchase-categories.json', updated)

  return {
    success: true,
    data: { id }
  }
})
