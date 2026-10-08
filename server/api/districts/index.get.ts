import { readData } from '~/server/utils/data'
import type { District } from '~/server/types/location'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const items = readData<District>('districts.json')

  let filtered = [...items]

  if (query.province) {
    const provQuery = String(query.province).toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.province.toLowerCase() === provQuery ||
        d.provinceId.toLowerCase() === provQuery
    )
  }

  if (query.regency) {
    const regQuery = String(query.regency).toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.regency.toLowerCase() === regQuery ||
        d.regencyId.toLowerCase() === regQuery
    )
  }

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.regency.toLowerCase().includes(s) ||
        d.province.toLowerCase().includes(s) ||
        (d.postalCode && d.postalCode.includes(s)) ||
        (d.createdBy && d.createdBy.toLowerCase().includes(s))
    )
  }

  if (query.status) {
    filtered = filtered.filter((d) => d.status?.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})
