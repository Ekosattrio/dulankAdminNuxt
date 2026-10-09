import type { Unit, UnitFormData, UnitFilterParams } from '#server/types/unit'

interface ResponseData {
  success: boolean
  data: Unit[]
  message?: string
}

export function useUnits(filterParams?: Ref<UnitFilterParams> | UnitFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/units', {
    key: 'units-list',
    query: params
  })

  const units = computed<Unit[]>(() => data.value?.data ?? [])

  const saveUnit = async (payload: UnitFormData) => {
    const res = await apiFetch<{ success: boolean; data: Unit; message?: string }>('/api/units', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteUnit = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/units/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    units,
    pending,
    error,
    refresh,
    saveUnit,
    deleteUnit
  }
}
