import type { Unit } from '~/types/unit'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allUnits = await readJSON<Unit[]>('units.json', [])

  let filtered = allUnits

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.shortName.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Units fetched successfully')
})

