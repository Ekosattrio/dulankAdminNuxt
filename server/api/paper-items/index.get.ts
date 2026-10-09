import { defineEventHandler, getQuery } from 'h3'
import { getPaperItems } from '~/server/utils/paperShopData'
import type { PaperItemFilterParams } from '#server/types/paper-shop'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PaperItemFilterParams
  const result = getPaperItems(query)

  return {
    success: true,
    data: result.items,
    stats: result.stats
  }
})

