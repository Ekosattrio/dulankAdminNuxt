import type { JasaLainItem, JasaLainFormData } from '#server/types/calculator-components'

interface ResponseData {
  success: boolean
  data: JasaLainItem[]
  meta: {
    total: number
    active: number
    deactive: number
  }
}

export function useJasaLain(filterParams?: Ref<{ search?: string; status?: string; unit?: string }> | { search?: string; status?: string; unit?: string }) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/calculator-components/jasa-lain', {
    key: 'calculator-jasa-lain-list',
    query: params
  })

  const items = computed<JasaLainItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.meta ?? { total: 0, active: 0, deactive: 0 })

  const saveItem = async (payload: JasaLainFormData) => {
    const res = await apiFetch<{ success: boolean; data: JasaLainItem; message?: string }>('/api/calculator-components/jasa-lain', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/calculator-components/jasa-lain/${id}`, {
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

