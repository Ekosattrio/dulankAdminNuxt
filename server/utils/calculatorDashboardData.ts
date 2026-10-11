import type { CalculatorDashboardData, CalculatorDashboardUser, CalculatorDashboardUserUpdate } from '../types/calculator-dashboard'
import { readJSON, writeJSON } from './data'

const FILE_NAME = 'calculator-dashboard.json'

function invalid(message: string, statusCode = 400): never {
  throw createError({ statusCode, statusMessage: message })
}

export function getCalculatorDashboardData(): CalculatorDashboardData {
  const raw = readJSON<CalculatorDashboardData>(FILE_NAME)
  if (!raw || !raw.telemetry || !Array.isArray(raw.users) || !raw.telemetry.chart || !Array.isArray(raw.telemetry.chart.labels)) {
    invalid('Calculator dashboard data is invalid', 500)
  }
  if (raw.users.some(user => !user.id || !user.userId || !user.employeeId || !user.departmentId || !user.user || !Number.isFinite(user.calculate) || !Number.isFinite(user.request) || !Number.isFinite(user.usage))) {
    invalid('Calculator dashboard user data is invalid', 500)
  }
  return raw
}

export function updateCalculatorDashboardUser(id: number, patch: CalculatorDashboardUserUpdate): CalculatorDashboardUser | null {
  const current = getCalculatorDashboardData()
  const idx = current.users.findIndex(u => u.id === id)
  if (idx === -1) return null

  const existing = current.users[idx]
  if (!existing) return null
  if (patch.user !== undefined && !patch.user.trim()) invalid('User name is required')
  for (const [label, value] of [['Calculate', patch.calculate], ['Request', patch.request], ['Usage', patch.usage]] as const) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) invalid(`${label} must be a non-negative number`)
  }
  if (patch.usage !== undefined && patch.usage > 100) invalid('Usage must not exceed 100')
  if (patch.status !== undefined && patch.status !== 'Active' && patch.status !== 'Disabled') invalid('Status is invalid')
  const updated: CalculatorDashboardUser = {
    ...existing,
    id: existing.id,
    user: patch.user?.trim() ?? existing.user,
    calculate: typeof patch.calculate === 'number' ? patch.calculate : existing.calculate,
    request: typeof patch.request === 'number' ? patch.request : existing.request,
    usage: typeof patch.usage === 'number' ? patch.usage : existing.usage,
    status: patch.status ?? existing.status,
    updatedAt: new Date().toISOString()
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
