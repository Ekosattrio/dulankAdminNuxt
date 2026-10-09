import type { FlowSummary, JobListFilterParams, JobListItem } from '#server/types/job-list'
import { isDateWithinRange } from './dateRange'
import { readJobListData } from './jobListData'

export function listJobItems(filters: JobListFilterParams = {}): JobListItem[] {
  const items = readJobListData()
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
  const items = readJobListData()
  return items.find((i) => String(i.id) === String(id) || i.no === id) || null
}

export function getFlowSummaries(): FlowSummary[] {
  const baselineFlows: Record<string, number> = {
    'Design': 252,
    'Cetak SM 52': 15,
    'Potong Sisir': 210,
    'Cetak Outdoor': 56,
    'Cetak A3+': 125,
    'Cetak Multilith': 137,
    'Finishing Komplit': 255,
    'Sablon Kaos': 5,
    'Laminating': 25,
  }

  const items = readJobListData()
  const counts: Record<string, number> = { ...baselineFlows }

  items.forEach((item) => {
    counts[item.flow] = (counts[item.flow] ?? 0) + 1
  })

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }))
}
