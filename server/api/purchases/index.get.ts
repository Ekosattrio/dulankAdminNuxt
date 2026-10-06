import { defineEventHandler, getQuery } from 'h3'
import { readData } from '~/server/utils/data'
import type { Purchase, PurchaseFilterParams } from '~/types/purchase'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PurchaseFilterParams
  const purchases = readData<Purchase>('purchases.json')

  let filtered = [...purchases]

  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.noPurchase.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.product.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
    )
  }

  if (query.status && query.status !== 'All' && query.status !== 'All Status' && query.status !== '') {
    filtered = filtered.filter((p) => p.status.toLowerCase() === query.status!.toLowerCase())
  }

  if (query.paymentStatus && query.paymentStatus !== 'All' && query.paymentStatus !== 'All Payment' && query.paymentStatus !== '') {
    filtered = filtered.filter((p) => p.paymentStatus.toLowerCase() === query.paymentStatus!.toLowerCase())
  }

  return {
    success: true,
    data: filtered,
    meta: { total: filtered.length }
  }
})
