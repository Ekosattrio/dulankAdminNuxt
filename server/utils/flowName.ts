import type { FlowName, FlowNameFilterParams, FlowNameFormData } from '#server/types/flow-name'
import { isDateWithinRange } from './dateRange'
import { readFlowNameData, writeFlowNameData } from './flowNameData'

function nextFlowNameNo(items: FlowName[]): string {
  const numbers = items
    .map((item) => {
      const match = item.no?.match(/^JBP-(\d+)$/i)
      return match ? Number(match[1]) : 0
    })
    .filter((n) => !Number.isNaN(n))

  const max = numbers.length ? Math.max(...numbers) : 0
  return `JBP-${String(max + 1).padStart(4, '0')}`
}

function nextFlowNameId(items: FlowName[]): string {
  const ids = items.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id))
  const max = ids.length ? Math.max(...ids) : 0
  return String(max + 1)
}

export function listFlowNames(filters: FlowNameFilterParams = {}): FlowName[] {
  const items = readFlowNameData()
  const search = filters.search?.trim().toLowerCase()
  const category = filters.category?.trim().toLowerCase()
  const flowNameFilter = filters.flowName?.trim().toLowerCase()
  const startDate = filters.startDate?.trim()
  const endDate = filters.endDate?.trim()

  return items.filter((item) => {
    if (category && category !== 'all' && item.category.toLowerCase() !== category) {
      return false
    }

    if (flowNameFilter && flowNameFilter !== 'all' && !item.name.toLowerCase().includes(flowNameFilter)) {
      return false
    }

    if (search) {
      const haystack = [
        item.no,
        item.category,
        item.name,
        item.flowAssignee,
        item.flowType,
        item.createDate,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(search)) return false
    }

    if ((startDate || endDate) && item.createDate) {
      // Create date format: "Admin, 2025-10-13 10:35:00" -> extract date part "2025-10-13"
      const match = item.createDate.match(/\d{4}-\d{2}-\d{2}/)
      if (match) {
        if (!isDateWithinRange(match[0], startDate, endDate)) {
          return false
        }
      }
    }

    return true
  })
}

export function getFlowNameById(id: string): FlowName | null {
  const items = readFlowNameData()
  return items.find((item) => String(item.id) === String(id) || item.no === id) || null
}

export function createFlowName(payload: FlowNameFormData): FlowName {
  const name = payload.name?.trim()
  const category = payload.category?.trim()

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Flow name is required' })
  }
  if (!category) {
    throw createError({ statusCode: 400, statusMessage: 'Flow category is required' })
  }

  const items = readFlowNameData()
  const now = new Date()
  const dateFormatted = `Admin, ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`

  const newItem: FlowName = {
    id: nextFlowNameId(items),
    no: payload.no?.trim() || nextFlowNameNo(items),
    category,
    name,
    incentiveAmount: payload.incentiveAmount !== undefined ? Number(payload.incentiveAmount) : 0,
    unitIncentive: payload.unitIncentive !== undefined ? payload.unitIncentive.trim() : 'Per Job',
    flowAssignee: payload.flowAssignee?.trim() || 'Admin',
    flowType: payload.flowType?.trim() || 'In-House',
    createDate: payload.createDate?.trim() || dateFormatted,
  }

  items.unshift(newItem)
  writeFlowNameData(items)
  return newItem
}

export function updateFlowName(id: string, payload: FlowNameFormData): FlowName {
  const name = payload.name?.trim()
  const category = payload.category?.trim()

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Flow name is required' })
  }
  if (!category) {
    throw createError({ statusCode: 400, statusMessage: 'Flow category is required' })
  }

  const items = readFlowNameData()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Flow name not found' })
  }

  const current = items[index]
  const updated: FlowName = {
    ...current,
    category,
    name,
    incentiveAmount: payload.incentiveAmount !== undefined ? Number(payload.incentiveAmount) : current.incentiveAmount,
    unitIncentive: payload.unitIncentive !== undefined ? payload.unitIncentive.trim() : current.unitIncentive,
    flowAssignee: payload.flowAssignee !== undefined ? payload.flowAssignee.trim() : current.flowAssignee,
    flowType: payload.flowType !== undefined ? payload.flowType.trim() : current.flowType,
  }

  items[index] = updated
  writeFlowNameData(items)
  return updated
}

export function deleteFlowName(id: string): FlowName {
  const items = readFlowNameData()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Flow name not found' })
  }

  const [removed] = items.splice(index, 1)
  writeFlowNameData(items)
  return removed
}
