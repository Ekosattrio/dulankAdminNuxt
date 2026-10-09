import { readJSON, writeJSON } from './data'
import type {
  IncomeCategoryItem,
  IncomeCategoryFormData,
  IncomeCategoryFilterParams
} from '#server/types/income-category'

const FILE_NAME = 'income-categories.json'

function nowTimestamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}, Admin`
}

export function getIncomeCategoryList(params?: IncomeCategoryFilterParams): {
  items: IncomeCategoryItem[]
  stats: {
    total: number
    active: number
    inactive: number
  }
} {
  const all = readJSON<IncomeCategoryItem[]>(FILE_NAME, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (i) =>
        i.no.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    )
  }

  const stats = {
    total: all.length,
    active: all.filter((i) => i.status === 'Active').length,
    inactive: all.filter((i) => i.status === 'Inactive').length
  }

  return { items: filtered, stats }
}

export function saveIncomeCategoryItem(payload: IncomeCategoryFormData): IncomeCategoryItem {
  const all = readJSON<IncomeCategoryItem[]>(FILE_NAME, [])

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        name: payload.name.trim(),
        description: payload.description.trim(),
        status: payload.status || all[idx].status || 'Active',
        updatedAt: new Date().toISOString()
      }
      writeJSON(FILE_NAME, all)
      return all[idx]
    }
  }

  const newId = String(Date.now())
  const seq = String(all.length + 1).padStart(3, '0')
  const newItem: IncomeCategoryItem = {
    id: newId,
    no: `INC${seq}`,
    name: payload.name.trim(),
    description: payload.description.trim(),
    status: payload.status || 'Active',
    created: nowTimestamp(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  all.unshift(newItem)
  writeJSON(FILE_NAME, all)
  return newItem
}

export function deleteIncomeCategoryItem(id: string): boolean {
  const all = readJSON<IncomeCategoryItem[]>(FILE_NAME, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(FILE_NAME, filtered)
    return true
  }
  return false
}

