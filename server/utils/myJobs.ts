import type { JobStatus, MyJob, MyJobFilterParams, MyJobFormData, MyJobStatusUpdatePayload } from '#server/types/my-job'

const filename = 'my-jobs.json'
const statuses: JobStatus[] = ['Waiting', 'On Process', 'Complete', 'Hold']

function readItems(): MyJob[] { return readJSON<MyJob[]>(filename, []) }
function writeItems(items: MyJob[]): void { writeJSON(filename, items) }

function nonNegative(value: number | string | undefined, label: string): number | undefined {
  if (value === undefined || value === '') return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw createError({ statusCode: 400, statusMessage: `${label} must be a non-negative number` })
  }
  return parsed
}

export function listMyJobs(filters: MyJobFilterParams = {}): MyJob[] {
  const search = filters.search?.trim().toLowerCase()
  const priority = filters.priority?.trim().toLowerCase()
  const status = filters.status?.trim().toLowerCase()
  return readItems().filter((item) => {
    if (search && ![item.flowName, item.product, item.title, item.description]
      .join(' ').toLowerCase().includes(search)) return false
    if (priority && priority !== 'all' && item.priority.toLowerCase() !== priority) return false
    if (status && status !== 'all' && item.status.toLowerCase() !== status) return false
    return true
  })
}

export function saveMyJob(payload: MyJobFormData): MyJob {
  if (!payload.flowName?.trim() || !payload.title?.trim() || !payload.product?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Flow name, product, and job title are required' })
  }
  if (!statuses.includes(payload.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid job status' })
  }
  const items = readItems()
  if (payload.id) {
    const index = items.findIndex((item) => item.id === payload.id)
    if (index < 0 || !items[index]) throw createError({ statusCode: 404, statusMessage: 'Job not found' })
    const current = items[index]
    const updated: MyJob = { ...current, ...payload, id: current.id }
    items[index] = updated
    writeItems(items)
    return updated
  }
  const item: MyJob = {
    ...payload,
    id: String(Math.max(0, ...items.map((candidate) => Number(candidate.id) || 0)) + 1),
    qtyOk: nonNegative(payload.qtyOk, 'Qty OK'),
    qtyRusak: nonNegative(payload.qtyRusak, 'Qty damaged'),
  }
  items.unshift(item)
  writeItems(items)
  return item
}

export function updateMyJob(id: string, payload: MyJobStatusUpdatePayload): MyJob {
  if (!statuses.includes(payload.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid job status' })
  }
  if (payload.qtyOk === undefined || payload.qtyOk === '' || payload.qtyRusak === undefined || payload.qtyRusak === '') {
    throw createError({ statusCode: 400, statusMessage: 'Qty OK and Qty damaged are required' })
  }
  const items = readItems()
  const index = items.findIndex((item) => item.id === id)
  if (index < 0 || !items[index]) throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  const updated: MyJob = {
    ...items[index],
    status: payload.status,
    qtyOk: nonNegative(payload.qtyOk, 'Qty OK'),
    qtyRusak: nonNegative(payload.qtyRusak, 'Qty damaged'),
  }
  items[index] = updated
  writeItems(items)
  return updated
}

export function deleteMyJob(id: string): MyJob {
  const items = readItems()
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  const [removed] = items.splice(index, 1)
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  writeItems(items)
  return removed
}
