import type { AnalyticsDashboard } from '#server/types/analytics-dashboard'

export function useAnalyticsDashboard() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: AnalyticsDashboard }>('/api/v1/admin/dashboard', { key: 'analytics-dashboard' })
  const dashboard = computed(() => data.value?.data || null)
  return { dashboard, pending, error, refresh }
}
