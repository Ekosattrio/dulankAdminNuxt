import { readData, writeData } from '~/server/utils/data'
import type { Department } from '~/types/department'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<Department>('departments.json')

  const updated = items.filter((d) => String(d.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Department not found'
    })
  }

  writeData('departments.json', updated)

  return {
    success: true,
    data: { id }
  }
})

