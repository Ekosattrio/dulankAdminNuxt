import type { MyIncentive } from '~/types/my-incentive'
import { isDateWithinRange } from '#server/utils/dateRange'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<MyIncentive[]>('my-incentives.json', [])

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter((item) =>
      (item.jobTitle && item.jobTitle.toLowerCase().includes(s)) ||
      (item.flowName && item.flowName.toLowerCase().includes(s)) ||
      (item.process && item.process.toLowerCase().includes(s)) ||
      (item.code && item.code.toLowerCase().includes(s)) ||
      (item.unit && item.unit.toLowerCase().includes(s))
    )
  }

  if (query.process && query.process !== 'All' && query.process !== 'All Process') {
    filtered = filtered.filter((item) => item.process.toLowerCase() === String(query.process).toLowerCase())
  }

  if (query.status && query.status !== 'All') {
    filtered = filtered.filter((item) => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter((item) => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  const totalCount = filtered.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0)
  const totalAmount = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  return {
    success: true,
    data: filtered,
    stats: {
      totalCount,
      totalAmount
    }
  }
})
