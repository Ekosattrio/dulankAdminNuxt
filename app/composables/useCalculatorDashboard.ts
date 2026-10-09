import type {
  CalculatorDashboardData,
  CalculatorDashboardUser,
  CalculatorDashboardResponse
} from '#server/types/calculator-dashboard'

export function useCalculatorDashboard() {
  const { data: response, pending, error, refresh } = useFetch<CalculatorDashboardResponse>('/api/calculator/dashboard', {
    key: 'calculator-dashboard-data',
    lazy: false
  })

  const telemetry = computed(() => response.value?.data?.telemetry || {
    currentUsers: 0,
    totalRequest: 0,
    totalCalculate: 0,
    requestGrowth: '0%',
    calculateGrowth: '0%'
  })

  const users = computed(() => response.value?.data?.users || [])

  async function updateUser(id: number, payload: Partial<CalculatorDashboardUser>) {
    const res = await $fetch<CalculatorDashboardResponse>(`/api/calculator/dashboard/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteUser(id: number) {
    const res = await $fetch<{ success: boolean; message: string }>(`/api/calculator/dashboard/${id}`, {
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

