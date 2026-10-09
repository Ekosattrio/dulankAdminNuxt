import type { KomponenFiksItem, KomponenFiksFormData } from '#server/types/calculator-components'

interface ResponseData {
  success: boolean
  data: KomponenFiksItem[]
  meta: {
    total: number
    active: number
    deactive: number
  }
}

export function useKomponenFiks(filterParams?: Ref<{ search?: string; status?: string }> | { search?: string; status?: string }) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/calculator-components/komponen-fiks', {
    key: 'calculator-komponen-fiks-list',
    query: params
  })

  const items = computed<KomponenFiksItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.meta ?? { total: 0, active: 0, deactive: 0 })

  const saveItem = async (payload: KomponenFiksFormData) => {
    const res = await $fetch<{ success: boolean; data: KomponenFiksItem; message?: string }>('/api/calculator-components/komponen-fiks', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/calculator-components/komponen-fiks/${id}`, {
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

