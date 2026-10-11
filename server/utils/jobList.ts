import type { FlowSummary, JobListFilterParams, JobListItem } from '#server/types/job-list'
import { isDateWithinRange } from './dateRange'

export function listJobItems(filters: JobListFilterParams = {}): JobListItem[] {
  const items = readJSON<JobListItem[]>('job-list.json', [])
  const search = filters.search?.trim().toLowerCase()
  const flow = filters.flow?.trim().toLowerCase()

  return items.filter((item) => {
    if (search) {
      const haystack = [item.no, item.customer, item.product, item.flow, item.assignee, item.jobTitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }

    if (flow && flow !== 'all' && item.flow.toLowerCase() !== flow) {
      return false
    }

    if (filters.startDate || filters.endDate) {
      if (!isDateWithinRange(item.salesDate, filters.startDate, filters.endDate) &&
          !isDateWithinRange(item.dateComplete, filters.startDate, filters.endDate)) {
        return false
      }
    }

    return true
  })
}

export function getJobItemById(id: string): JobListItem | null {
  const items = readJSON<JobListItem[]>('job-list.json', [])
  return items.find((i) => String(i.id) === String(id) || i.no === id) || null
}

export function getFlowSummaries(): FlowSummary[] {
  const items = readJSON<JobListItem[]>('job-list.json', [])
  const counts: Record<string, number> = {}

  items.forEach((item) => {
    counts[item.flow] = (counts[item.flow] ?? 0) + 1
  })

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }))
}
