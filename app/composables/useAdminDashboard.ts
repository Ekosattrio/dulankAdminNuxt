import type { AdminDashboardSnapshot } from '#server/types/admin-dashboard'

export function useAdminDashboard() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: AdminDashboardSnapshot }>('/api/admin-dashboard', { key: 'admin-dashboard' })
  const dashboard = computed(() => data.value?.data || null)
  return { dashboard, pending, error, refresh }
}
