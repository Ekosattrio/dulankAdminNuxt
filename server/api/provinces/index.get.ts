import { readData } from '~/server/utils/data'
import type { Province } from '~/server/types/location'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = readData<Province>('provinces.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.code && p.code.toLowerCase().includes(s)) ||
        (p.createdBy && p.createdBy.toLowerCase().includes(s))
    )
  }

  if (query.status) {
    filtered = filtered.filter((p) => p.status?.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})
