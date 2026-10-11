import type { VoucherCommand, VoucherQuery, VoucherRecord, VoucherStatus, VoucherStore, VoucherType } from '#server/types/voucher'
import { isDateWithinRange } from './dateRange'
import { readJSON, writeJSON } from './data'

const types = new Set<VoucherType>(['Fixed', 'Percentage'])
const statuses = new Set<VoucherStatus>(['Active', 'Inactive'])
const isoDate = /^\d{4}-\d{2}-\d{2}$/
function invalid(message: string, statusCode = 400): never { throw createError({ statusCode, statusMessage: message }) }
function clean(value: unknown) { return typeof value === 'string' ? value.trim() : '' }
function validateStore(store: VoucherStore) {
  if (!store || !Array.isArray(store.stores) || !Array.isArray(store.products) || !Array.isArray(store.filterProducts) || !Array.isArray(store.records)) invalid('Voucher data is invalid', 500)
  const storeIds = new Set(store.stores.map(item => item.id)), productIds = new Set(store.products.map(item => item.id)), ids = new Set<string>()
  for (const record of store.records) {
    if (!record.id || ids.has(record.id) || !storeIds.has(record.storeId) || !record.createdByEmployeeId || !record.name || !record.code || !types.has(record.type) || !statuses.has(record.status)) invalid('Voucher record is invalid', 500)
    if (![record.discount, record.limit, record.used].every(value => Number.isFinite(value) && value >= 0) || record.used > record.limit && record.limit !== 0) invalid('Voucher numeric values are invalid', 500)
    if ((record.startDate && !isoDate.test(record.startDate)) || (record.endDate && !isoDate.test(record.endDate)) || (record.startDate && record.endDate && record.endDate < record.startDate)) invalid('Voucher dates are invalid', 500)
    if (!Array.isArray(record.productIds) || record.productIds.some(id => !productIds.has(id)) || (!record.allProducts && record.productIds.length === 0) || !record.createdAt || !record.updatedAt) invalid('Voucher relations are invalid', 500)
    if (record.type === 'Percentage' && record.discount > 100) invalid('Voucher percentage is invalid', 500)
    ids.add(record.id)
  }
  return store
}
function readStore() { return validateStore(readJSON<VoucherStore>('vouchers.json')) }
function validateCommand(command: VoucherCommand, store: VoucherStore) {
  const name = clean(command.name), code = clean(command.code)
  if (!name || !code) invalid('Name and code are required')
  if (!types.has(command.type) || !statuses.has(command.status)) invalid('Voucher type or status is invalid')
  if (!Number.isFinite(command.discount) || command.discount <= 0 || (command.type === 'Percentage' && command.discount > 100)) invalid('Discount is invalid')
  if (!Number.isInteger(command.limit) || command.limit < 0) invalid('Limit must be a non-negative integer')
  const startDate = clean(command.startDate), endDate = clean(command.endDate)
  if ((startDate && !isoDate.test(startDate)) || (endDate && !isoDate.test(endDate)) || (startDate && endDate && endDate < startDate)) invalid('Voucher date range is invalid')
  const validProducts = new Set(store.products.map(item => item.id)), productIds = [...new Set(command.productIds || [])]
  if (productIds.some(id => !validProducts.has(id)) || (!command.allProducts && productIds.length === 0)) invalid('Choose at least one valid product')
  return { ...command, name, code, startDate, endDate, productIds: command.allProducts ? [] : productIds }
}
export function listVouchers(query: VoucherQuery) {
  const store = readStore(), search = clean(query.search).toLowerCase()
  const data = store.records.filter(record =>
    (!search || [record.name, record.code, record.type, record.status].some(value => value.toLowerCase().includes(search)))
    && (!query.name || record.name === query.name)
    && (!query.type || record.type === query.type)
    && (!query.storeId || record.storeId === query.storeId)
    && (!query.productId || record.allProducts || record.productIds.includes(query.productId))
    && (!(query.startDate || query.endDate) || isDateWithinRange(record.endDate || record.startDate, query.startDate, query.endDate)),
  )
  return { data, meta: { stores: store.stores, products: store.products, filterProducts: store.filterProducts, names: store.records.map(record => record.name) } }
}
export function createVoucher(command: VoucherCommand) {
  const store = readStore(), input = validateCommand(command, store)
  if (store.records.some(item => item.code.toLowerCase() === input.code.toLowerCase())) invalid('Voucher code already exists', 409)
  const now = new Date().toISOString(), max = store.records.reduce((value, item) => Math.max(value, Number(item.id.match(/\d+$/)?.[0] || 0)), 0)
  const record: VoucherRecord = { ...input, id: `voucher-${String(max + 1).padStart(3, '0')}`, storeId: store.stores[0]?.id || invalid('Voucher store is unavailable', 500), createdByEmployeeId: 'employee-admin-001', used: 0, createdAt: now, updatedAt: now }
  store.records.unshift(record); writeJSON('vouchers.json', store); return record
}
export function updateVoucher(id: string, command: VoucherCommand) {
  const store = readStore(), index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Voucher not found', 404)
  const input = validateCommand(command, store)
  if (store.records.some(item => item.id !== id && item.code.toLowerCase() === input.code.toLowerCase())) invalid('Voucher code already exists', 409)
  const record: VoucherRecord = { ...store.records[index]!, ...input, updatedAt: new Date().toISOString() }
  store.records[index] = record; writeJSON('vouchers.json', store); return record
}
export function deleteVoucher(id: string) {
  const store = readStore(), index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Voucher not found', 404)
  const [record] = store.records.splice(index, 1); writeJSON('vouchers.json', store); return record!
}
