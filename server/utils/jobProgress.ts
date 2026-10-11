import type { JobProgress, JobProgressFilters, JobProgressStats, JobProgressUpdate } from '#server/types/job-progress'
import { isDateWithinRange } from './dateRange'

const filename = 'job-progress.json'

function readItems(): JobProgress[] { return readJSON<JobProgress[]>(filename, []) }
function writeItems(items: JobProgress[]): void { writeJSON(filename, items) }

export function listJobProgress(filters: JobProgressFilters = {}): JobProgress[] {
  const search = filters.search?.trim().toLowerCase()
  const process = filters.process?.trim().toLowerCase()
  return readItems().filter((item) => {
    if (search && ![item.progressCode, item.product, item.description, item.completedBy, item.note].join(' ').toLowerCase().includes(search)) return false
    if (process && process !== 'all' && item.process.toLowerCase() !== process) return false
    if ((filters.startDate || filters.endDate) && !isDateWithinRange(item.completedAt || item.createdAt, filters.startDate, filters.endDate)) return false
    return true
  })
}

export function getJobProgressStats(): JobProgressStats {
  const items = readItems()
  const completed = items.filter((item) => item.isCompleted).length
  return { total: items.length, completed, pending: items.length - completed }
}

export function updateJobProgress(id: string, payload: JobProgressUpdate): JobProgress {
  const items = readItems()
  const index = items.findIndex((item) => item.id === id || item.progressCode === id)
  const current = items[index]
  if (index < 0 || !current) throw createError({ statusCode: 404, statusMessage: 'Job progress not found' })
  const qtyOk = payload.qtyOk === undefined ? current.qtyOk : Number(payload.qtyOk)
  const qtyRusak = payload.qtyRusak === undefined ? current.qtyRusak : Number(payload.qtyRusak)
  if (![qtyOk, qtyRusak].every((value) => Number.isFinite(value) && value >= 0)) throw createError({ statusCode: 400, statusMessage: 'Qty OK and Qty Rusak must be non-negative numbers' })
  if (payload.isCompleted && !String(payload.completedBy ?? current.completedBy).trim()) throw createError({ statusCode: 400, statusMessage: 'Completed by is required' })
  const now = new Date()
  const completedAt = payload.isCompleted
    ? current.completedAt || `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`
    : ''
  const updated: JobProgress = {
    ...current,
    isCompleted: Boolean(payload.isCompleted),
    completedBy: payload.isCompleted ? String(payload.completedBy ?? current.completedBy).trim() : '',
    employeeId: payload.isCompleted ? payload.employeeId ?? current.employeeId : undefined,
    completedAt,
    note: payload.note === undefined ? current.note : String(payload.note).trim(),
    qtyOk,
    qtyRusak,
    updatedAt: now.toISOString(),
  }
  items[index] = updated
  writeItems(items)
  return updated
}
