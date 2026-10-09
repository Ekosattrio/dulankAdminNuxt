import { defineEventHandler, getQuery } from 'h3'
import { getPaperSizes } from '~/server/utils/paperShopData'
import type { PaperSizeFilterParams } from '#server/types/paper-shop'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PaperSizeFilterParams
  const result = getPaperSizes(query)

  return {
    success: true,
    data: result.sizes,
    stats: result.stats
  }
})
