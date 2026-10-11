import type { JobBranchFilterParams, JobBranchHistoryItem, JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'
import { isDateWithinRange } from './dateRange'

export function listJobBranches(filters: JobBranchFilterParams = {}): JobBranchItem[] {
  const items = readJSON<JobBranchItem[]>('job-branches.json', [])
  const search = filters.search?.trim().toLowerCase()
  const branch = filters.branch?.trim().toLowerCase()
  const priority = filters.priority?.trim().toLowerCase()

  return items.filter((item) => {
    if (search) {
      const haystack = [item.no, item.branch, item.customer, item.product, item.flowName, item.jobTitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }

    if (branch && branch !== 'all' && branch !== 'branch' && item.branch.toLowerCase() !== branch) {
      return false
    }

    if (priority && priority !== 'all' && priority !== 'priority' && item.priority.toLowerCase() !== priority) {
      return false
    }

    if (filters.startDate || filters.endDate) {
      if (item.date && !isDateWithinRange(item.date, filters.startDate, filters.endDate)) {
        return false
      }
    }

    return true
  })
}

export function getJobBranchById(id: string): JobBranchItem | null {
  const items = readJSON<JobBranchItem[]>('job-branches.json', [])
  return items.find((i) => String(i.id) === String(id) || i.no === id) || null
}

export function updateJobBranch(id: string, payload: JobBranchUpdatePayload): JobBranchItem {
  const items = readJSON<JobBranchItem[]>('job-branches.json', [])
  const index = items.findIndex((i) => String(i.id) === String(id) || i.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Job branch record not found' })
  }

  const current = items[index]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Job branch record not found' })
  }
  if (payload.incentiveAmount !== undefined) {
    const amount = Number(payload.incentiveAmount)
    if (!Number.isFinite(amount) || amount < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Incentive amount must be a non-negative number' })
    }
  }
  for (const info of payload.infoList ?? []) {
    if (!info.label.trim()) throw createError({ statusCode: 400, statusMessage: 'Information label is required' })
  }
  for (const info of payload.afterInfoList ?? []) {
    if (!info.label.trim()) throw createError({ statusCode: 400, statusMessage: 'Completion information label is required' })
  }
  const updated: JobBranchItem = {
    ...current,
    priority: payload.priority || current.priority,
    status: payload.status || current.status,
    branch: payload.branch || current.branch,
    infoList: payload.infoList !== undefined ? payload.infoList : current.infoList,
    afterInfoList: payload.afterInfoList !== undefined ? payload.afterInfoList : current.afterInfoList,
    assignees: payload.assignees !== undefined ? payload.assignees : current.assignees,
    incentiveAmount: payload.incentiveAmount !== undefined ? Number(payload.incentiveAmount) : current.incentiveAmount,
    incentiveUnit: payload.incentiveUnit !== undefined ? payload.incentiveUnit : current.incentiveUnit,
  }

  items[index] = updated
  writeJSON('job-branches.json', items)
  return updated
}

export function listJobBranchHistory(filters: JobBranchFilterParams = {}): JobBranchHistoryItem[] {
  const search = filters.search?.trim().toLowerCase()
  const branch = filters.branch?.trim().toLowerCase()
  return readJSON<JobBranchHistoryItem[]>('job-branches-history.json', []).filter((item) => {
    if (search && ![item.customer, item.branch, item.flowName].join(' ').toLowerCase().includes(search)) return false
    if (branch && branch !== 'all' && branch !== 'branch' && item.branch.toLowerCase() !== branch) return false
    if ((filters.startDate || filters.endDate) && !isDateWithinRange(item.date, filters.startDate, filters.endDate)) return false
    return true
  })
}
