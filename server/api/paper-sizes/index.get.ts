import { readData } from '~/server/utils/data'
import type { PaperSize } from '~/types/paper-size'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<PaperSize>('paper-sizes.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(s) || item.dimension.toLowerCase().includes(s)
    )
  }

  if (query.status) {
    filtered = filtered.filter((item) => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

