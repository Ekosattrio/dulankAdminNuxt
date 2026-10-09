import { readData } from '~/server/utils/data'
import type { IncentiveItem } from '~/types/incentive'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<IncentiveItem>('incentives.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.employee.toLowerCase().includes(s) ||
        item.code.toLowerCase().includes(s) ||
        item.period.toLowerCase().includes(s)
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

