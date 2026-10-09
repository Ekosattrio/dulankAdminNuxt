import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { Purchase } from '~/types/purchase'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const purchases = readData<Purchase>('purchases.json')

  const updated = purchases.filter((p) => String(p.id) !== String(id) && String(p.noPurchase) !== String(id))

  if (updated.length === purchases.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Purchase record not found'
    })
  }

  writeData('purchases.json', updated)

  return {
    success: true,
    data: { id }
  }
})
