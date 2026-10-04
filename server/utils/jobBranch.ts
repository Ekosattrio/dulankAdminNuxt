import type { JobBranchFilterParams, JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'
import { isDateWithinRange } from './dateRange'
import { readJobBranchData, writeJobBranchData } from './jobBranchData'

export function listJobBranches(filters: JobBranchFilterParams = {}): JobBranchItem[] {
  const items = readJobBranchData()
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
  const items = readJobBranchData()
  return items.find((i) => String(i.id) === String(id) || i.no === id) || null
}

export function updateJobBranch(id: string, payload: JobBranchUpdatePayload): JobBranchItem {
  const items = readJobBranchData()
  const index = items.findIndex((i) => String(i.id) === String(id) || i.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Job branch record not found' })
  }

  const current = items[index]
  const updated: JobBranchItem = {
    ...current,
    priority: payload.priority || current.priority,
    status: payload.status || current.status,
    branch: payload.branch || current.branch,
    infoList: payload.infoList !== undefined ? payload.infoList : current.infoList,
    afterInfoList: payload.afterInfoList !== undefined ? payload.afterInfoList : current.afterInfoList,
    assignees: payload.assignees !== undefined ? payload.assignees : current.assignees,
    incentiveAmount: payload.incentiveAmount !== undefined ? payload.incentiveAmount : current.incentiveAmount,
    incentiveUnit: payload.incentiveUnit !== undefined ? payload.incentiveUnit : current.incentiveUnit,
  }

  items[index] = updated
  writeJobBranchData(items)
  return updated
}
