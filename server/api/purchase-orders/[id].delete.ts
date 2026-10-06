import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseOrder } from '~/types/purchase-order'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
  }

  const orders = readData<PurchaseOrder>('purchase-orders.json')
  const index = orders.findIndex((p) => String(p.id) === String(id) || String(p.noPO) === String(id))

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Purchase Order not found' })
  }

  const deleted = orders.splice(index, 1)[0]
  writeData('purchase-orders.json', orders)

  return {
    success: true,
    data: deleted,
    message: 'Purchase Order deleted successfully'
  }
})
