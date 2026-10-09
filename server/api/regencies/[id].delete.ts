import { readData, writeData } from '~/server/utils/data'
import type { Regency } from '~/server/types/location'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<Regency>('regencies.json')

  const updated = items.filter((r) => String(r.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Regency not found'
    })
  }

  writeData('regencies.json', updated)

  return {
    success: true,
    data: { id },
    message: 'Regency deleted successfully'
  }
})
