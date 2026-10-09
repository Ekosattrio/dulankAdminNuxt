import type { WorkshopService, WorkshopServiceCategory, WorkshopServiceFormData } from '../types/workshop-service'
import type { Store } from '../types/store'
import { readJSON, writeJSON } from './data'

const categories: WorkshopServiceCategory[] = ['printing', 'laminate', 'die_cutting', 'hot_print']
const numericFields: Array<keyof WorkshopServiceFormData> = [
  'maxHeight', 'maxWidth', 'quantityMinimum', 'price', 'druckPrice', 'pricePerCm', 'minimumPrice',
  'standardPrice', 'standardMinimum', 'halfCutPrice', 'halfCutMinimum', 'minimumCalculation',
]

export function isWorkshopCategory(value: string): value is WorkshopServiceCategory {
  return categories.includes(value as WorkshopServiceCategory)
}

export function listWorkshopServices(category: WorkshopServiceCategory) {
  return readJSON<WorkshopService[]>('workshop-services.json', [])
    .filter(item => item.category === category && !item.archivedAt)
}

function cleanPayload(input: WorkshopServiceFormData): WorkshopServiceFormData {
  const payload = { ...input, name: input.name?.trim(), storeId: input.storeId || '1' }
  for (const field of numericFields) {
    if (payload[field] !== undefined) (payload as Record<string, unknown>)[field] = Number(payload[field])
  }
  return payload
}

function validate(input: WorkshopServiceFormData) {
  if (!isWorkshopCategory(input.category)) throw new Error('Kategori layanan tidak valid')
  if (!input.name && input.category !== 'die_cutting') throw new Error('Nama wajib diisi')
  const stores = readJSON<Store[]>('stores.json', [])
  if (!stores.some(store => store.id === input.storeId)) throw new Error('Store relation tidak ditemukan')
  if (input.category === 'printing') {
    if (!input.printingType) throw new Error('Printing Type wajib dipilih')
    if (!Number.isFinite(input.price) || Number(input.price) <= 0) throw new Error('Price wajib lebih dari 0')
    if (input.printingType !== 'Large Format' && (!input.maxHeight || !input.maxWidth)) throw new Error('Max Size Paper Area wajib diisi')
    if (input.printingType === 'Offset' && (!input.quantityMinimum || !Number.isFinite(input.druckPrice) || Number(input.druckPrice) <= 0)) {
      throw new Error('Qty Minimum dan Druck Price wajib lebih dari 0')
    }
  }
  if (input.category === 'laminate' || input.category === 'hot_print') {
    if (!input.maxSize || !Number.isFinite(input.pricePerCm) || Number(input.pricePerCm) <= 0 || !Number.isFinite(input.minimumPrice) || Number(input.minimumPrice) <= 0) {
      throw new Error('Ukuran dan harga wajib lebih dari 0')
    }
    if (input.category === 'hot_print' && (!Number.isFinite(input.minimumCalculation) || Number(input.minimumCalculation) <= 0)) {
      throw new Error('Harga Minim Hitungan wajib lebih dari 0')
    }
  }
  if (input.category === 'die_cutting' && (
    !input.maxSize || !Number.isFinite(input.standardPrice) || Number(input.standardPrice) <= 0
    || !Number.isFinite(input.standardMinimum) || Number(input.standardMinimum) <= 0
    || !Number.isFinite(input.halfCutPrice) || Number(input.halfCutPrice) <= 0
    || !Number.isFinite(input.halfCutMinimum) || Number(input.halfCutMinimum) <= 0
  )) {
    throw new Error('Ukuran dan seluruh harga pond wajib lebih dari 0')
  }
}

export function saveWorkshopService(input: WorkshopServiceFormData) {
  const payload = cleanPayload(input)
  validate(payload)
  const records = readJSON<WorkshopService[]>('workshop-services.json', [])
  const now = new Date().toISOString()

  if (payload.id) {
    const index = records.findIndex(item => item.id === payload.id && !item.archivedAt)
    if (index < 0) throw new Error('Layanan tidak ditemukan')
    const existing = records[index]!
    const updated: WorkshopService = { ...existing, ...payload, id: existing.id, category: existing.category, status: existing.status, updatedAt: now }
    records[index] = updated
    writeJSON('workshop-services.json', records)
    return updated
  }

  const prefix = payload.category.replace('_', '-')
  const maxNumber = records
    .filter(item => item.category === payload.category)
    .reduce((max, item) => Math.max(max, Number(item.id.match(/(\d+)$/)?.[1] || 0)), 0)
  const record: WorkshopService = {
    ...payload,
    id: `${prefix}-${String(maxNumber + 1).padStart(3, '0')}`,
    name: payload.name || 'Pond Service',
    storeId: payload.storeId || '1',
    status: 'Active',
    updatedAt: now,
  }
  records.unshift(record)
  writeJSON('workshop-services.json', records)
  return record
}

export function archiveWorkshopService(id: string) {
  const records = readJSON<WorkshopService[]>('workshop-services.json', [])
  const index = records.findIndex(item => item.id === id && !item.archivedAt)
  if (index < 0) throw new Error('Layanan tidak ditemukan')
  records[index] = { ...records[index]!, archivedAt: new Date().toISOString() }
  writeJSON('workshop-services.json', records)
  return records[index]!
}
