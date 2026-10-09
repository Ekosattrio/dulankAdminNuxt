import { defineEventHandler, getQuery } from 'h3'
import { readData } from '~/server/utils/data'
import type { PurchaseReturn, PurchaseReturnFilterParams } from '~/types/purchase-return'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PurchaseReturnFilterParams
  const returns = readData<PurchaseReturn>('purchase-returns.json')

  let filtered = [...returns]

  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.noPR.toLowerCase().includes(q) ||
        r.noPurchase.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
    )
  }

  if (query.status && query.status !== 'All' && query.status !== '') {
    filtered = filtered.filter((r) => r.status.toLowerCase() === query.status!.toLowerCase())
  }

  return {
    success: true,
    data: filtered,
    meta: { total: filtered.length }
  }
})
