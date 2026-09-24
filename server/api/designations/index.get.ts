import { readData } from '~/server/utils/data'
import type { Designation } from '~/types/designation'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<Designation>('designations.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(s))
  }

  if (query.status) {
    filtered = filtered.filter((d) => d.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

