import type { MyIncentive, MyIncentiveFilterParams, MyIncentiveFormData, MyIncentiveStats } from '#server/types/my-incentive'
import { isDateWithinRange } from './dateRange'

const filename = 'my-incentives.json'
function readItems(): MyIncentive[] { return readJSON<MyIncentive[]>(filename, []) }
function writeItems(items: MyIncentive[]): void { writeJSON(filename, items) }

function finiteNonNegative(value: unknown, label: string): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw createError({ statusCode: 400, statusMessage: `${label} must be a non-negative number` })
  }
  return parsed
}

export function listMyIncentives(filters: MyIncentiveFilterParams = {}): { items: MyIncentive[]; stats: MyIncentiveStats } {
  const search = filters.search?.trim().toLowerCase()
  const process = filters.process?.trim().toLowerCase()
  const status = filters.status?.trim().toLowerCase()
  const items = readItems().filter((item) => {
    if (search && ![item.jobTitle, item.flowName, item.process, item.code, item.unit]
      .filter(Boolean).join(' ').toLowerCase().includes(search)) return false
    if (process && process !== 'all' && process !== 'all process' && item.process.toLowerCase() !== process) return false
    if (status && status !== 'all' && item.status.toLowerCase() !== status) return false
    if ((filters.startDate || filters.endDate) && !isDateWithinRange(item.date, filters.startDate, filters.endDate)) return false
    return true
  })
  return {
    items,
    stats: {
      totalCount: items.reduce((sum, item) => sum + item.qty, 0),
      totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
    },
  }
}

export function saveMyIncentive(payload: MyIncentiveFormData): MyIncentive {
  if (!payload.jobTitle?.trim() || !payload.flowName?.trim() || !payload.process?.trim() || !payload.unit?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Job title, flow, process, and unit are required' })
  }
  const incentive = finiteNonNegative(payload.incentive, 'Incentive')
  const qty = finiteNonNegative(payload.qty, 'Qty')
  const items = readItems()
  if (payload.id) {
    const index = items.findIndex((item) => item.id === payload.id)
    if (index < 0 || !items[index]) throw createError({ statusCode: 404, statusMessage: 'Incentive not found' })
    const current = items[index]
    const updated: MyIncentive = { ...current, ...payload, id: current.id, incentive, qty, amount: incentive * qty }
    items[index] = updated
    writeItems(items)
    return updated
  }
  const nextId = Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1
  const item: MyIncentive = {
    ...payload,
    id: String(nextId),
    code: payload.code?.trim() || `INC-${String(nextId).padStart(2, '0')}`,
    incentive,
    qty,
    amount: incentive * qty,
  }
  items.unshift(item)
  writeItems(items)
  return item
}

export function deleteMyIncentive(id: string): MyIncentive {
  const items = readItems()
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Incentive not found' })
  const [removed] = items.splice(index, 1)
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Incentive not found' })
  writeItems(items)
  return removed
}
