import { readData } from '~/server/utils/data'
import type { PaperPrice } from '~/types/paper-price'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<PaperPrice>('paper-prices.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.nama.toLowerCase().includes(s) ||
        p.group.toLowerCase().includes(s) ||
        p.merk.toLowerCase().includes(s) ||
        String(p.gramatur).includes(s)
    )
  }

  if (query.status) {
    filtered = filtered.filter((p) => p.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.group) {
    filtered = filtered.filter((p) => p.group.toLowerCase() === String(query.group).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

