import type { CustomField, CustomFieldInput } from '../types/custom-fields'
import { readJSON, writeJSON } from './data'

const FILE_NAME = 'custom-fields.json'

export function getCustomFields(): CustomField[] {
  try {
    const data = readJSON<CustomField[]>(FILE_NAME)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error reading custom-fields.json:', err)
    return []
  }
}

export function createCustomField(input: CustomFieldInput): CustomField {
  const list = getCustomFields()
  const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0)
  const newField: CustomField = {
    ...input,
    id: maxId + 1
  }
  list.push(newField)
  writeJSON(FILE_NAME, list)
  return newField
}

export function updateCustomField(id: number, input: Partial<CustomFieldInput>): CustomField | null {
  const list = getCustomFields()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  const current = list[idx]
  if (!current) return null

  const updated: CustomField = {
    ...current,
    ...input,
    id
  }
  list[idx] = updated
  writeJSON(FILE_NAME, list)
  return updated
}

export function deleteCustomField(id: number): boolean {
  const list = getCustomFields()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return false

  list.splice(idx, 1)
  writeJSON(FILE_NAME, list)
  return true
}

