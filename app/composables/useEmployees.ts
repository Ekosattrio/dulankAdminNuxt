import type { EmployeeItem, EmployeeFormData, EmployeeFilterParams } from '#server/types/employee'

interface ResponseData {
  success: boolean
  data: EmployeeItem[]
  message?: string
}

export function useEmployees() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/employees', {
    key: 'employees-list'
  })

  const employees = computed<EmployeeItem[]>(() => data.value?.data ?? [])

  const saveEmployee = async (payload: EmployeeFormData) => {
    const res = await apiFetch<{ success: boolean; data: EmployeeItem; message?: string }>('/api/employees', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteEmployee = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/employees/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    employees,
    pending,
    error,
    refresh,
    saveEmployee,
    deleteEmployee
  }
}
