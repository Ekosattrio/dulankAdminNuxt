import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'

interface ResponseData {
  success: boolean
  data: KomponenMinimumItem[]
  meta: {
    total: number
    active: number
    deactive: number
  }
}

export function useKomponenMinimum(filterParams?: Ref<{ search?: string; status?: string }> | { search?: string; status?: string }) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/calculator-components/komponen-minimum', {
    key: 'calculator-komponen-minimum-list',
    query: params
  })

  const items = computed<KomponenMinimumItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.meta ?? { total: 0, active: 0, deactive: 0 })

  const saveItem = async (payload: KomponenMinimumFormData) => {
    const res = await apiFetch<{ success: boolean; data: KomponenMinimumItem; message?: string }>('/api/calculator-components/komponen-minimum', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/calculator-components/komponen-minimum/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    items,
    stats,
    pending,
    error,
    refresh,
    saveItem,
    deleteItem
  }
}

