import type { DiscountPlanCommand, DiscountPlanCustomerSegmentCommand, DiscountPlanQuery, DiscountPlanRecord, DiscountPlanStatus, DiscountPlanStore, DiscountPlanView } from '#server/types/discount-plan'
import { readJSON, writeJSON } from './data'

const statuses = new Set<DiscountPlanStatus>(['Active', 'Inactive'])
function invalid(message: string, statusCode = 400): never { throw createError({ statusCode, statusMessage: message }) }
function clean(value: unknown) { return typeof value === 'string' ? value.trim() : '' }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'customer' }

function validateStore(store: DiscountPlanStore) {
  if (!store || !Array.isArray(store.customerSegments) || !Array.isArray(store.records)) invalid('Discount plan data is invalid', 500)
  const segmentIds = new Set<string>()
  for (const segment of store.customerSegments) {
    if (!segment.id || segmentIds.has(segment.id) || !segment.name || typeof segment.availableInFilter !== 'boolean' || typeof segment.availableInForm !== 'boolean' || !segment.createdAt) invalid('Discount plan customer segment is invalid', 500)
    segmentIds.add(segment.id)
  }
  const ids = new Set<string>()
  for (const record of store.records) {
    if (!record.id || ids.has(record.id) || !segmentIds.has(record.customerSegmentId) || !record.createdByEmployeeId || !record.name || !statuses.has(record.status) || !record.createdAt || !record.updatedAt) invalid('Discount plan record is invalid', 500)
    ids.add(record.id)
  }
  return store
}

function readStore() { return validateStore(readJSON<DiscountPlanStore>('discount-plans.json')) }
function view(record: DiscountPlanRecord, store: DiscountPlanStore): DiscountPlanView {
  return { ...record, customers: store.customerSegments.find(item => item.id === record.customerSegmentId)?.name || invalid('Discount plan relation is invalid', 500) }
}
function validateCommand(command: DiscountPlanCommand, store: DiscountPlanStore) {
  const name = clean(command.name), customerSegmentId = clean(command.customerSegmentId)
  if (!name) invalid('Plan Name is required')
  if (!store.customerSegments.some(item => item.id === customerSegmentId)) invalid('Choose a valid customer')
  if (!statuses.has(command.status)) invalid('Status is invalid')
  return { name, customerSegmentId, status: command.status }
}

export function listDiscountPlans(query: DiscountPlanQuery) {
  const store = readStore(), search = clean(query.search).toLowerCase()
  const data = store.records.map(record => view(record, store)).filter(record =>
    (!search || [record.name, record.customers, record.status].some(value => value.toLowerCase().includes(search)))
    && (!query.customerSegmentId || record.customerSegmentId === query.customerSegmentId)
    && (!query.status || record.status === query.status),
  )
  return {
    data,
    meta: {
      filterCustomerSegments: store.customerSegments.filter(item => item.availableInFilter),
      formCustomerSegments: store.customerSegments.filter(item => item.availableInForm),
    },
  }
}

export function createDiscountPlan(command: DiscountPlanCommand) {
  const store = readStore(), input = validateCommand(command, store)
  if (store.records.some(item => item.name.toLowerCase() === input.name.toLowerCase())) invalid('Discount plan name already exists', 409)
  const now = new Date().toISOString(), max = store.records.reduce((value, item) => Math.max(value, Number(item.id.match(/\d+$/)?.[0] || 0)), 0)
  const record: DiscountPlanRecord = { ...input, id: `discount-plan-${String(max + 1).padStart(3, '0')}`, createdByEmployeeId: 'employee-admin-001', createdAt: now, updatedAt: now }
  store.records.unshift(record); writeJSON('discount-plans.json', store); return view(record, store)
}

export function updateDiscountPlan(id: string, command: DiscountPlanCommand) {
  const store = readStore(), index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Discount plan not found', 404)
  const input = validateCommand(command, store)
  if (store.records.some(item => item.id !== id && item.name.toLowerCase() === input.name.toLowerCase())) invalid('Discount plan name already exists', 409)
  const record: DiscountPlanRecord = { ...store.records[index]!, ...input, updatedAt: new Date().toISOString() }
  store.records[index] = record; writeJSON('discount-plans.json', store); return view(record, store)
}

export function deleteDiscountPlan(id: string) {
  const store = readStore(), index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Discount plan not found', 404)
  const [record] = store.records.splice(index, 1); writeJSON('discount-plans.json', store); return view(record!, store)
}

export function createDiscountPlanCustomerSegment(command: DiscountPlanCustomerSegmentCommand) {
  const store = readStore(), name = clean(command.name)
  if (!name) invalid('Customer is required')
  if (store.customerSegments.some(item => item.name.toLowerCase() === name.toLowerCase())) invalid('Customer already exists', 409)
  const now = new Date().toISOString(), base = `segment-${slug(name)}`
  let id = base, suffix = 2
  while (store.customerSegments.some(item => item.id === id)) id = `${base}-${suffix++}`
  const segment = { id, name, availableInFilter: true, availableInForm: true, createdAt: now }
  store.customerSegments.push(segment); writeJSON('discount-plans.json', store); return segment
}
