import { defineEventHandler, getQuery } from 'h3'
import { readData } from '~/server/utils/data'
import type { PurchaseItem, PurchaseItemFilterParams } from '~/types/purchase-item'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PurchaseItemFilterParams
  const items = readData<PurchaseItem>('purchase-items.json')

  let filtered = [...items]

  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.product.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.merk && item.merk.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    )
  }

  if (query.category && query.category !== 'All' && query.category !== 'All Categories' && query.category !== '') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === query.category!.toLowerCase())
  }

  return {
    success: true,
    data: filtered,
    meta: { total: filtered.length }
  }
})
