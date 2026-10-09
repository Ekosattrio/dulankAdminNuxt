import type { Unit, UnitFormData } from '~/types/unit'

export default defineEventHandler(async (event) => {
  const body = await readBody<UnitFormData>(event)

  if (!body || !body.name || !body.shortName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unit name and short name are required'
    })
  }

  const allUnits = await readJSON<Unit[]>('units.json', [])

  if (body.id) {
    // Update
    const idx = allUnits.findIndex(u => u.id === body.id)
    if (idx !== -1) {
      const current = allUnits[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Unit not found' })
      const updated: Unit = {
        ...current,
        name: body.name,
        shortName: body.shortName,
        status: body.status || 'Active'
      }
      allUnits[idx] = updated
      await writeJSON('units.json', allUnits)
      return createResponse(updated, 'Unit updated successfully')
    }
  }

  // Create
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  const newUnit: Unit = {
    id: String(Date.now()),
    name: body.name,
    shortName: body.shortName,
    itemUsed: 0,
    createdOn: dateStr,
    status: body.status || 'Active'
  }

  allUnits.unshift(newUnit)
  await writeJSON('units.json', allUnits)

  return createResponse(newUnit, 'Unit created successfully')
})

