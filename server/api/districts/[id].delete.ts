import { readData, writeData } from '~/server/utils/data'
import type { District } from '~/server/types/location'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<District>('districts.json')

  const updated = items.filter((d) => String(d.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'District not found'
    })
  }

  writeData('districts.json', updated)

  return {
    success: true,
    data: { id },
    message: 'District deleted successfully'
  }
})
