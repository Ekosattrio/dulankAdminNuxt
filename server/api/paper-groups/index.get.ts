import { defineEventHandler, getQuery } from 'h3'
import { getPaperGroups } from '~/server/utils/paperShopData'
import type { PaperGroupFilterParams } from '#server/types/paper-shop'

export default defineEventHandler((event) => {
  const query = getQuery(event) as PaperGroupFilterParams
  const result = getPaperGroups(query)

  return {
    success: true,
    data: result.groups,
    stats: result.stats
  }
})

