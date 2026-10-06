import { defineEventHandler, getQuery } from 'h3'
import { readData } from '~/server/utils/data'
import type { PurchaseOrder, PurchaseOrderFilterParams } from '~/types/purchase-order'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PurchaseOrderFilterParams
  const orders = readData<PurchaseOrder>('purchase-orders.json')

  let filtered = [...orders]

  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.noPO.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.noPurchase.toLowerCase().includes(q) ||
        p.created.toLowerCase().includes(q)
    )
  }

  if (query.status && query.status !== 'All' && query.status !== '') {
    filtered = filtered.filter((p) => p.poStatus.toLowerCase() === query.status!.toLowerCase())
  }

  if (query.goodsStatus && query.goodsStatus !== 'All' && query.goodsStatus !== '') {
    filtered = filtered.filter((p) => p.goodsStatus.toLowerCase() === query.goodsStatus!.toLowerCase())
  }

  return {
    success: true,
    data: filtered,
    meta: { total: filtered.length }
  }
})
