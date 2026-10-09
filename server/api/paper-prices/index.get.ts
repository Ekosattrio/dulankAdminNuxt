import { defineEventHandler, getQuery } from 'h3'
import { getPaperPrices } from '~/server/utils/paperShopData'
import type { PaperPriceFilterParams } from '#server/types/paper-shop'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PaperPriceFilterParams
  const result = getPaperPrices(query)

  return {
    success: true,
    data: result.prices,
    stats: result.stats
  }
})

