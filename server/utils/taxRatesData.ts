import type { TaxRateItem, TaxRateInput } from '../types/tax-rates'
import { readJSON, writeJSON } from './data'

const FILE_NAME = 'tax-rates.json'

export function getTaxRates(): TaxRateItem[] {
  try {
    const data = readJSON<TaxRateItem[]>(FILE_NAME)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error reading tax-rates.json:', err)
    return []
  }
}

export function createTaxRate(input: TaxRateInput): TaxRateItem {
  const list = getTaxRates()
  const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0)
  const now = new Date()
  const createdOn = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const newItem: TaxRateItem = {
    ...input,
    id: maxId + 1,
    createdOn
  }
  list.push(newItem)
  writeJSON(FILE_NAME, list)
  return newItem
}

export function updateTaxRate(id: number, input: Partial<TaxRateInput>): TaxRateItem | null {
  const list = getTaxRates()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  const current = list[idx]
  if (!current) return null

  const updated: TaxRateItem = {
    ...current,
    ...input,
    id
  }
  list[idx] = updated
  writeJSON(FILE_NAME, list)
  return updated
}

export function deleteTaxRate(id: number): boolean {
  const list = getTaxRates()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return false

  list.splice(idx, 1)
  writeJSON(FILE_NAME, list)
  return true
}

