import { readData } from '~/server/utils/data'
import type { MyIncentive } from '~/types/my-incentive'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<MyIncentive>('my-incentives.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (item) => item.code.toLowerCase().includes(s) || item.process.toLowerCase().includes(s)
    )
  }

  if (query.process) {
    filtered = filtered.filter((item) => item.process.toLowerCase() === String(query.process).toLowerCase())
  }

  if (query.status) {
    filtered = filtered.filter((item) => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

