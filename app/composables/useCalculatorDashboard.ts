import type {
  CalculatorDashboardData,
  CalculatorDashboardUser,
  CalculatorDashboardUserUpdate,
  CalculatorDashboardResponse
} from '#server/types/calculator-dashboard'

export function useCalculatorDashboard() {
  const { data: response, pending, error, refresh } = useApiFetch<CalculatorDashboardResponse>('/api/v1/admin/calculator/dashboard', {
    key: 'calculator-dashboard-data',
    lazy: false
  })

  const telemetry = computed(() => response.value?.data?.telemetry || {
    currentUsers: 0,
    totalRequest: 0,
    totalCalculate: 0,
    requestGrowth: '0%',
    calculateGrowth: '0%',
    chart: { labels: [], thisWeek: [], lastWeek: [] }
  })

  const users = computed(() => response.value?.data?.users || [])

  async function updateUser(id: number, payload: CalculatorDashboardUserUpdate) {
    const res = await apiFetch<CalculatorDashboardResponse>(`/api/v1/admin/calculator/dashboard/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteUser(id: number) {
    const res = await apiFetch<{ success: boolean; message: string }>(`/api/v1/admin/calculator/dashboard/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    telemetry,
    users,
    pending,
    error,
    refresh,
    updateUser,
    deleteUser
  }
}

