import type { Designation, DesignationFormData, DesignationFilterParams } from '#server/types/designation'

interface ResponseData {
  success: boolean
  data: Designation[]
  message?: string
}

export function useDesignations(filterParams?: Ref<DesignationFilterParams> | DesignationFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/designations', {
    key: 'designations-list',
    query: params
  })

  const designations = computed<Designation[]>(() => (data.value?.data ?? []).map((item) => ({
    ...item,
    members: item.members || [],
    totalMembers: item.totalMembers ?? (item as any).employeeCount ?? 0,
    createdOn: item.createdOn || '-',
    status: item.status || 'Active'
  })))

  const saveDesignation = async (payload: DesignationFormData) => {
    const res = await apiFetch<{ success: boolean; data: Designation; message?: string }>('/api/v1/admin/designations', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDesignation = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/designations/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    designations,
    pending,
    error,
    refresh,
    saveDesignation,
    deleteDesignation
  }
}
