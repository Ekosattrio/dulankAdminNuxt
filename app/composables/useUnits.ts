import type { Unit, UnitFormData, UnitFilterParams } from '#server/types/unit'

interface ResponseData {
  success: boolean
  data: Unit[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Unit
  message?: string
}

/**
 * Satuan produk — backend Laravel `/api/v1/admin/units`.
 */
export function useUnits(filterParams?: Ref<UnitFilterParams> | UnitFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/units', {
    key: 'units-list',
    query
  })

  const units = computed<Unit[]>(() => data.value?.data ?? [])

  const saveUnit = async (payload: UnitFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/units/${encodeURIComponent(id)}` : '/api/v1/admin/units',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteUnit = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/units/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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