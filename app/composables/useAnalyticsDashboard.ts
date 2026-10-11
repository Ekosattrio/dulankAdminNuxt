import type { AnalyticsDashboard } from '#server/types/analytics-dashboard'

export function useAnalyticsDashboard() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: AnalyticsDashboard }>('/api/analytics-dashboard', { key: 'analytics-dashboard' })
  const dashboard = computed(() => data.value?.data || null)
  return { dashboard, pending, error, refresh }
}
