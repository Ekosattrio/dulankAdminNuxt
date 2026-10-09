import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readData, writeData } from '~/server/utils/data'
import type { PurchaseReturn } from '~/types/purchase-return'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
  }

  const returns = readData<PurchaseReturn>('purchase-returns.json')
  const index = returns.findIndex((r) => String(r.id) === String(id) || String(r.noPR) === String(id))

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Purchase Return not found' })
  }

  const deleted = returns.splice(index, 1)[0]
  writeData('purchase-returns.json', returns)

  return {
    success: true,
    data: deleted,
    message: 'Purchase Return deleted successfully'
  }
})
