import type { Department, DepartmentFormData, DepartmentFilterParams } from '#server/types/department'

interface ResponseData {
  success: boolean
  data: Department[]
  message?: string
}

export function useDepartments() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/departments', {
    key: 'departments-list'
  })

  const departments = computed<Department[]>(() => data.value?.data ?? [])

  const saveDepartment = async (payload: DepartmentFormData) => {
    const res = await apiFetch<{ success: boolean; data: Department; message?: string }>('/api/v1/admin/departments', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDepartment = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/departments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    departments,
    pending,
    error,
    refresh,
    saveDepartment,
    deleteDepartment
  }
}
