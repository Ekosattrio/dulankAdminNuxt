import type { PaperItem, PaperItemFormData, PaperItemFilterParams } from '#server/types/paper-shop'

interface ResponseData {
  success: boolean
  data: PaperItem[]
  stats: {
    total: number
    totalGroups: number
    active: number
    deactive: number
  }
}

export function usePaperItemsSelf(filterParams?: Ref<PaperItemFilterParams> | PaperItemFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/paper-items', {
    key: 'paper-items-self-list',
    query: params
  })

  const items = computed<PaperItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { total: 0, totalGroups: 0, active: 0, deactive: 0 })

  const saveItem = async (payload: PaperItemFormData) => {
    const res = await apiFetch<{ success: boolean; data: PaperItem; message?: string }>('/api/paper-items', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/paper-items/${id}`, {
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

