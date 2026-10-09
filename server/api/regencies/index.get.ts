import { readData } from '~/server/utils/data'
import type { Regency } from '~/server/types/location'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = readData<Regency>('regencies.json')

  let filtered = [...items]

  if (query.province) {
    const provQuery = String(query.province).toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.province.toLowerCase() === provQuery ||
        r.provinceId.toLowerCase() === provQuery
    )
  }

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.province.toLowerCase().includes(s) ||
        (r.createdBy && r.createdBy.toLowerCase().includes(s))
    )
  }

  if (query.status) {
    filtered = filtered.filter((r) => r.status?.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})
