import type {
  CalculatorDashboardData,
  CalculatorDashboardUser,
  CalculatorDashboardTelemetry
} from '../types/calculator-dashboard'
import { readJSON, writeJSON } from './data'

const FILE_NAME = 'calculator-dashboard.json'

function getDefaultDashboardData(): CalculatorDashboardData {
  return {
    telemetry: {
      currentUsers: 0,
      totalRequest: 0,
      totalCalculate: 0,
      requestGrowth: '0%',
      calculateGrowth: '0%'
    },
    users: []
  }
}

export function getCalculatorDashboardData(): CalculatorDashboardData {
  try {
    const raw = readJSON<CalculatorDashboardData>(FILE_NAME)
    if (raw && typeof raw === 'object' && Array.isArray(raw.users)) {
      return raw
    }
    return getDefaultDashboardData()
  } catch (error) {
    console.error('Error reading calculator-dashboard.json:', error)
    return getDefaultDashboardData()
  }
}

export function updateCalculatorDashboardUser(id: number, patch: Partial<CalculatorDashboardUser>): CalculatorDashboardUser | null {
  const current = getCalculatorDashboardData()
  const idx = current.users.findIndex(u => u.id === id)
  if (idx === -1) return null

  const existing = current.users[idx]
  if (!existing) return null
  const updated: CalculatorDashboardUser = {
    ...existing,
    ...patch,
    id: existing.id,
    calculate: typeof patch.calculate === 'number' ? patch.calculate : existing.calculate,
    request: typeof patch.request === 'number' ? patch.request : existing.request,
    usage: typeof patch.usage === 'number' ? patch.usage : existing.usage,
    status: patch.status === 'Disabled' ? 'Disabled' : 'Active'
  }

  current.users[idx] = updated
  writeJSON(FILE_NAME, current)
  return updated
}

export function deleteCalculatorDashboardUser(id: number): boolean {
  const current = getCalculatorDashboardData()
  const idx = current.users.findIndex(u => u.id === id)
  if (idx === -1) return false

  current.users.splice(idx, 1)
  writeJSON(FILE_NAME, current)
  return true
}
