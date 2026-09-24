import type { Designation, DesignationFormData, DesignationFilterParams } from '#server/types/designation'

interface ResponseData {
  success: boolean
  data: Designation[]
  message?: string
}

export function useDesignations(filterParams?: Ref<DesignationFilterParams> | DesignationFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/designations', {
    key: 'designations-list',
    query: params
  })

  const designations = computed<Designation[]>(() => data.value?.data ?? [])

  const saveDesignation = async (payload: DesignationFormData) => {
    const res = await $fetch<{ success: boolean; data: Designation; message?: string }>('/api/designations', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDesignation = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/designations/${id}`, {
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
