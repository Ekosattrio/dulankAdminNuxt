import { readData, writeData } from '~/server/utils/data'
import type { Designation } from '~/types/designation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<Designation>('designations.json')

  const updated = items.filter((d) => String(d.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Designation not found'
    })
  }

  writeData('designations.json', updated)

  return {
    success: true,
    data: { id }
  }
})

