import type { JobOrder, JobOrderFilterParams, JobOrderFormData } from '#server/types/job-order'
import type { JobOrderStep } from '#server/types/job-order'
import type { JobOrderContext } from '#server/types/job-order'
import { getOrderById } from './order'

const filename = 'job-orders.json'

function readItems(): JobOrder[] {
  return readJSON<JobOrder[]>(filename, [])
}

function writeItems(items: JobOrder[]): void {
  writeJSON(filename, items)
}

function required(value: unknown, label: string): string {
  const result = String(value ?? '').trim()
  if (!result) throw createError({ statusCode: 400, statusMessage: `${label} is required` })
  return result
}

function nextNumericId(items: JobOrder[]): string {
  return String(Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1)
}

function nextJobNumber(items: JobOrder[]): string {
  const max = Math.max(0, ...items.map((item) => Number(item.no.match(/\d+/)?.[0]) || 0))
  return `JO-${String(max + 1).padStart(4, '0')}`
}

export function listJobOrders(filters: JobOrderFilterParams = {}): JobOrder[] {
  const search = filters.search?.trim().toLowerCase()
  const status = filters.status?.trim().toLowerCase()
  const priority = filters.priority?.trim().toLowerCase()
  const category = filters.workflowCategory?.trim().toLowerCase()
  const workflowType = filters.workflowType?.trim().toLowerCase()

  return readItems().filter((item) => {
    if (search) {
      const haystack = [item.no, item.customer, item.product, item.jobTitle, item.salesNo]
        .filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (status && status !== 'all' && item.status.toLowerCase() !== status) return false
    if (priority && priority !== 'all' && item.priority.toLowerCase() !== priority) return false
    if (category && category !== 'all' && item.workflowCategory.toLowerCase() !== category) return false
    if (workflowType && workflowType !== 'all' && item.workflowType.toLowerCase() !== workflowType) return false
    return true
  })
}

export function getJobOrderCounts(): Record<string, number> {
  return readItems().reduce<Record<string, number>>((counts, item) => {
    counts[item.workflowType] = (counts[item.workflowType] ?? 0) + 1
    return counts
  }, {})
}

export function getJobOrder(id: string): JobOrder {
  const item = readItems().find((candidate) =>
    candidate.id === id || candidate.no === id || candidate.orderId === id,
  )
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
  return item
}

export function getJobOrderContext(jobOrderId?: string, orderId?: string): JobOrderContext {
  const items = readItems()
  const order = orderId ? getOrderById(orderId) : null
  let jobOrder: JobOrder | null = null

  if (order) {
    jobOrder = items.find((candidate) =>
      candidate.orderId === order.no || candidate.orderId === order.id,
    ) ?? null
  }
  if (!jobOrder && jobOrderId) {
    jobOrder = items.find((candidate) =>
      candidate.id === jobOrderId || candidate.no === jobOrderId || candidate.orderId === jobOrderId,
    ) ?? null
  }

  const relatedOrder = order || (jobOrder?.orderId ? getOrderById(jobOrder.orderId) : null)
  if (!jobOrder && !relatedOrder) {
    throw createError({ statusCode: 404, statusMessage: 'Job order context not found' })
  }
  return { jobOrder, order: relatedOrder }
}

function normalizeSteps(steps: JobOrderStep[] | undefined, fallback: JobOrderStep[]): JobOrderStep[] {
  if (steps === undefined) return fallback
  return steps.map((step, index) => {
    const name = required(step.name, `Flow name ${index + 1}`)
    const incentive = Number(step.incentive ?? 0)
    if (!Number.isFinite(incentive) || incentive < 0) {
      throw createError({ statusCode: 400, statusMessage: `Incentive ${index + 1} must be a non-negative number` })
    }
    const normalizeInfo = (values: JobOrderStep['infoList'], label: string) => (values ?? []).map((item, itemIndex) => ({
      id: String(item.id || `${index + 1}-${itemIndex + 1}`),
      label: required(item.label, `${label} ${itemIndex + 1}`),
      value: String(item.value ?? ''),
      inputType: item.inputType || 'Input Type',
    }))
    return {
      ...step,
      id: step.id || `${Date.now()}-${index}`,
      name,
      status: step.status || 'pending',
      flowType: step.flowType || 'In-House',
      branch: String(step.branch ?? ''),
      expenseName: String(step.expenseName ?? ''),
      assignees: String(step.assignees ?? ''),
      incentive,
      incentiveUnit: step.incentiveUnit || 'Job',
      infoList: normalizeInfo(step.infoList, 'Information label'),
      afterInfoList: normalizeInfo(step.afterInfoList, 'Completion information label'),
    }
  })
}

export function saveJobOrder(payload: JobOrderFormData): JobOrder {
  const items = readItems()
  const customer = required(payload.customer, 'Customer')
  const product = required(payload.product, 'Product')
  const jobTitle = required(payload.jobTitle, 'Job title')
  const dueDate = required(payload.dueDate, 'Due date')
  const qty = payload.qty === undefined || payload.qty === '' ? undefined : payload.qty

  if (payload.id) {
    const index = items.findIndex((item) => item.id === payload.id || item.no === payload.id)
    if (index < 0 || !items[index]) {
      throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
    }
    const current = items[index]
    const updated: JobOrder = {
      ...current,
      ...payload,
      id: current.id,
      no: current.no,
      customer,
      product,
      jobTitle,
      dueDate,
      qty,
      steps: normalizeSteps(payload.steps, current.steps),
    }
    items[index] = updated
    writeItems(items)
    return updated
  }

  const now = new Date()
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
  const item: JobOrder = {
    id: nextNumericId(items),
    no: payload.no?.trim() || nextJobNumber(items),
    orderId: payload.orderId,
    customerId: payload.customerId,
    productId: payload.productId,
    customer,
    product,
    jobTitle,
    description: String(payload.description ?? ''),
    qty,
    dueDate,
    priority: payload.priority,
    status: payload.status,
    workflowType: payload.workflowType || 'design',
    workflowCategory: payload.workflowCategory,
    salesNo: required(payload.salesNo, 'Sales number'),
    salesDate: date,
    shipping: required(payload.shipping, 'Shipping'),
    orderSummary: required(payload.orderSummary, 'Order summary'),
    branchId: payload.branchId,
    assignedTo: payload.assignedTo,
    inputSpecs: payload.inputSpecs,
    outputSpecs: payload.outputSpecs,
    steps: normalizeSteps(payload.steps, []),
  }
  items.unshift(item)
  writeItems(items)
  return item
}

export function deleteJobOrder(id: string): JobOrder {
  const items = readItems()
  const index = items.findIndex((item) => item.id === id || item.no === id)
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
  const [removed] = items.splice(index, 1)
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
  writeItems(items)
  return removed
}
