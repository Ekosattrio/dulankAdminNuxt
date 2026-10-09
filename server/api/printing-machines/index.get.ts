import { readData } from '~/server/utils/data'
import type { PrintingMachine } from '~/types/printing-machine'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<PrintingMachine>('printing-machines.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(s) ||
        m.type.toLowerCase().includes(s) ||
        m.maxArea.toLowerCase().includes(s)
    )
  }

  if (query.type) {
    filtered = filtered.filter((m) => m.type.toLowerCase() === String(query.type).toLowerCase())
  }

  if (query.status) {
    filtered = filtered.filter((m) => m.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

