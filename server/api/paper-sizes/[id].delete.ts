import { readData, writeData } from '~/server/utils/data'
import type { PaperSize } from '~/types/paper-size'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<PaperSize>('paper-sizes.json')

  const updated = items.filter((s) => String(s.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Paper size not found'
    })
  }

  writeData('paper-sizes.json', updated)

  return {
    success: true,
    data: { id }
  }
})

