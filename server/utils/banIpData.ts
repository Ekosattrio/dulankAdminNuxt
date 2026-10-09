import type { BanIpItem, BanIpInput } from '../types/ban-ip'
import { readJSON, writeJSON } from './data'

const FILE_NAME = 'ban-ip.json'

export function getBanIpList(): BanIpItem[] {
  try {
    const data = readJSON<BanIpItem[]>(FILE_NAME)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error reading ban-ip.json:', err)
    return []
  }
}

export function createBanIp(input: BanIpInput): BanIpItem {
  const list = getBanIpList()
  const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0)
  const now = new Date()
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const newItem: BanIpItem = {
    ...input,
    id: maxId + 1,
    date
  }
  list.unshift(newItem)
  writeJSON(FILE_NAME, list)
  return newItem
}

export function updateBanIp(id: number, input: Partial<BanIpInput>): BanIpItem | null {
  const list = getBanIpList()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null

  const updated: BanIpItem = {
    ...list[idx],
    ...input,
    id
  }
  list[idx] = updated
  writeJSON(FILE_NAME, list)
  return updated
}

export function deleteBanIp(id: number): boolean {
  const list = getBanIpList()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return false

  list.splice(idx, 1)
  writeJSON(FILE_NAME, list)
  return true
}

