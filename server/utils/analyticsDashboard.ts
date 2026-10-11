import type { AnalyticsDashboard } from '#server/types/analytics-dashboard'
import { readJSON } from './data'

export function getAnalyticsDashboard(): AnalyticsDashboard {
  return readJSON<AnalyticsDashboard>('analytics-dashboard.json')
}
