import { defineEventHandler, getQuery } from 'h3'
import { readData } from '~/server/utils/data'
import type { PurchaseCategory, PurchaseCategoryFilterParams } from '~/types/purchase-category'
import type { PurchaseItem } from '~/types/purchase-item'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PurchaseCategoryFilterParams
  const categories = readData<PurchaseCategory>('purchase-categories.json')
  const items = readData<PurchaseItem>('purchase-items.json')

  // Calculate items count per category
  const itemCountMap: Record<string, number> = {}
  items.forEach((item) => {
    itemCountMap[item.category] = (itemCountMap[item.category] || 0) + 1
  })

  let filtered = categories.map((cat) => ({
    ...cat,
    itemCount: itemCountMap[cat.name] || 0,
  }))

  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.created && c.created.toLowerCase().includes(q))
    )
  }

  if (query.status && query.status !== 'All' && query.status !== '') {
    filtered = filtered.filter((c) => c.status.toLowerCase() === query.status!.toLowerCase())
  }

  return {
    success: true,
    data: filtered,
    meta: { total: filtered.length },
  }
})
