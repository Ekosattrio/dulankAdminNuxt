import { readData, writeData } from '~/server/utils/data'
import type { Province } from '~/server/types/location'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<Province>('provinces.json')

  const updated = items.filter((p) => String(p.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Province not found'
    })
  }

  writeData('provinces.json', updated)

  return {
    success: true,
    data: { id },
    message: 'Province deleted successfully'
  }
})
