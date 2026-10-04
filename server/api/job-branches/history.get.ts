import type { JobBranchHistoryItem } from '#server/types/job-branch'
import { isDateWithinRange } from '#server/utils/dateRange'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<JobBranchHistoryItem[]>('job-branches-history.json', [])

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter((i) =>
      i.customer.toLowerCase().includes(s) ||
      i.branch.toLowerCase().includes(s) ||
      i.flowName.toLowerCase().includes(s)
    )
  }

  if (query.branch && query.branch !== 'Branch' && query.branch !== 'All') {
    filtered = filtered.filter((i) => i.branch.toLowerCase() === String(query.branch).toLowerCase())
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter((i) => isDateWithinRange(i.date, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
  }
})
