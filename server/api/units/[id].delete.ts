import type { Unit } from '~/types/unit'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unit ID is required'
    })
  }

  const allUnits = await readJSON<Unit[]>('units.json', [])
  const newUnits = allUnits.filter(u => u.id !== id)

  if (allUnits.length === newUnits.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Unit not found'
    })
  }

  await writeJSON('units.json', newUnits)

  return createResponse({ id }, 'Unit deleted successfully')
})

