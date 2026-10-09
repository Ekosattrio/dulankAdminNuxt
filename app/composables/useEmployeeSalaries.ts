import type { EmployeeSalaryItem, EmployeeSalaryFormData, EmployeeSalaryFilterParams } from '#server/types/employeeSalary'

interface ResponseData {
  success: boolean
  data: EmployeeSalaryItem[]
  message?: string
}

export function useEmployeeSalaries() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/employee-salaries', {
    key: 'employee-salaries-list'
  })

  const salaries = computed<EmployeeSalaryItem[]>(() => data.value?.data ?? [])

  const saveSalary = async (payload: EmployeeSalaryFormData) => {
    const res = await apiFetch<{ success: boolean; data: EmployeeSalaryItem; message?: string }>('/api/employee-salaries', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteSalary = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/employee-salaries/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    salaries,
    pending,
    error,
    refresh,
    saveSalary,
    deleteSalary
  }
}
