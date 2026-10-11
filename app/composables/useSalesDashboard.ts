import type { SalesDashboardData } from '#server/types/sales-dashboard'

interface SalesDashboardResponse { success: boolean; data: SalesDashboardData }

export function useSalesDashboard() {
  const { data, pending, error, refresh } = useApiFetch<SalesDashboardResponse>('/api/v1/admin/dashboard/sales', {
    key: 'sales-dashboard',
  })
  const dashboard = computed(() => data.value?.data)
  return {
    dashboard,
    bestSellers: computed(() => dashboard.value?.bestSellers || []),
    recentTransactions: computed(() => dashboard.value?.recentTransactions || []),
    countryMarkers: computed(() => dashboard.value?.countryMarkers || []),
    yearlyData: computed(() => dashboard.value?.yearlyData || {}),
    pending,
    error,
    refresh,
  }
}
