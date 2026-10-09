import { defineEventHandler, getRouterParam } from 'h3'
import type { Supplier } from '~/types/supplier'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, message: 'ID required' }

  let suppliers = readJSON<Supplier[]>('suppliers.json', [])
  const prevCount = suppliers.length
  suppliers = suppliers.filter(s => s.id !== id && s.supplierId !== id)

  if (suppliers.length < prevCount) {
    writeJSON('suppliers.json', suppliers)
    return createResponse({ id, deleted: true })
  }

  return { success: false, message: 'Supplier not found' }
})

