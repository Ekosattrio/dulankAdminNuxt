import type { Department, DepartmentFormData, DepartmentFilterParams } from '#server/types/department'

interface ResponseData {
  success: boolean
  data: Department[]
  message?: string
}

export function useDepartments(filterParams?: Ref<DepartmentFilterParams> | DepartmentFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/departments', {
    key: 'departments-list',
    query: params
  })

  const departments = computed<Department[]>(() => data.value?.data ?? [])

  const saveDepartment = async (payload: DepartmentFormData) => {
    const res = await $fetch<{ success: boolean; data: Department; message?: string }>('/api/departments', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDepartment = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/departments/${id}`, {
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
