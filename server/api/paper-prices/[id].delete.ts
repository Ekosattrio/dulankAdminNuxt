import { readData, writeData } from '~/server/utils/data'
import type { PaperPrice } from '~/types/paper-price'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<PaperPrice>('paper-prices.json')

  const updated = items.filter((p) => String(p.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Paper price not found'
    })
  }

  writeData('paper-prices.json', updated)

  return {
    success: true,
    data: { id }
  }
})

