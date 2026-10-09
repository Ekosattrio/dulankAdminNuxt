import type { WorkFlow, WorkFlowFilterParams, WorkFlowFormData } from '#server/types/work-flow'
import { isDateWithinRange } from './dateRange'
import { readWorkFlowData, writeWorkFlowData } from './workFlowData'

function nextWorkFlowNo(items: WorkFlow[]): string {
  const numbers = items
    .map((item) => {
      const match = item.no?.match(/^JAP-(\d+)$/i)
      return match ? Number(match[1]) : 0
    })
    .filter((n) => !Number.isNaN(n))

  const max = numbers.length ? Math.max(...numbers) : 0
  return `JAP-${String(max + 1).padStart(4, '0')}`
}

function nextWorkFlowId(items: WorkFlow[]): string {
  const ids = items.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id))
  const max = ids.length ? Math.max(...ids) : 0
  return String(max + 1)
}

export function listWorkFlows(filters: WorkFlowFilterParams = {}): WorkFlow[] {
  const items = readWorkFlowData()
  const search = filters.search?.trim().toLowerCase()
  const category = filters.category?.trim().toLowerCase()
  const startDate = filters.startDate?.trim()
  const endDate = filters.endDate?.trim()

  return items.filter((item) => {
    if (category && category !== 'all' && item.category.toLowerCase() !== category) {
      return false
    }

    if (search) {
      const haystack = [
        item.no,
        item.category,
        item.product,
        item.workflowSteps,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(search)) return false
    }

    if ((startDate || endDate) && item.date) {
      if (!isDateWithinRange(item.date, startDate, endDate)) {
        return false
      }
    }

    return true
  })
}

export function getWorkFlowById(id: string): WorkFlow | null {
  const items = readWorkFlowData()
  return items.find((item) => String(item.id) === String(id) || item.no === id) || null
}

export function createWorkFlow(payload: WorkFlowFormData): WorkFlow {
  const product = payload.product?.trim()
  const category = payload.category?.trim()
  const workflowSteps = payload.workflowSteps?.trim()

  if (!product) {
    throw createError({ statusCode: 400, statusMessage: 'Product is required' })
  }
  if (!category) {
    throw createError({ statusCode: 400, statusMessage: 'Category is required' })
  }
  if (!workflowSteps) {
    throw createError({ statusCode: 400, statusMessage: 'Workflow steps are required' })
  }

  const items = readWorkFlowData()
  const now = new Date()
  const dateFormatted = payload.date?.trim() || now.toLocaleDateString('en-GB')

  const newItem: WorkFlow = {
    id: nextWorkFlowId(items),
    no: payload.no?.trim() || nextWorkFlowNo(items),
    date: dateFormatted,
    category,
    product,
    workflowSteps,
    steps: payload.steps || [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }

  items.unshift(newItem)
  writeWorkFlowData(items)
  return newItem
}

export function updateWorkFlow(id: string, payload: WorkFlowFormData): WorkFlow {
  const product = payload.product?.trim()
  const category = payload.category?.trim()
  const workflowSteps = payload.workflowSteps?.trim()

  if (!product) {
    throw createError({ statusCode: 400, statusMessage: 'Product is required' })
  }
  if (!category) {
    throw createError({ statusCode: 400, statusMessage: 'Category is required' })
  }
  if (!workflowSteps) {
    throw createError({ statusCode: 400, statusMessage: 'Workflow steps are required' })
  }

  const items = readWorkFlowData()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Workflow not found' })
  }

  const current = items[index]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Workflow not found' })
  }
  const updated: WorkFlow = {
    ...current,
    product,
    category,
    workflowSteps,
    date: payload.date?.trim() || current.date,
    steps: payload.steps || current.steps || [],
    updatedAt: new Date().toISOString(),
  }

  items[index] = updated
  writeWorkFlowData(items)
  return updated
}

export function deleteWorkFlow(id: string): WorkFlow {
  const items = readWorkFlowData()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Workflow not found' })
  }

  const [removed] = items.splice(index, 1)
  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: 'Workflow not found' })
  }
  writeWorkFlowData(items)
  return removed
}
