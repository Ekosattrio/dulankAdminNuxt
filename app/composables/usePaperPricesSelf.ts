import type { PaperPrice, PaperPriceFormData, PaperPriceFilterParams } from '#server/types/paper-shop'

interface ResponseData {
  success: boolean
  data: PaperPrice[]
  stats: {
    total: number
    totalGroups: number
    active: number
    deactive: number
  }
}

export function usePaperPricesSelf(filterParams?: Ref<PaperPriceFilterParams> | PaperPriceFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/paper-prices', {
    key: 'paper-prices-self-list',
    query: params
  })

  const prices = computed<PaperPrice[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { total: 0, totalGroups: 0, active: 0, deactive: 0 })

  const savePrice = async (payload: PaperPriceFormData) => {
    const res = await $fetch<{ success: boolean; data: PaperPrice; message?: string }>('/api/paper-prices', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePrice = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/paper-prices/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    prices,
    stats,
    pending,
    error,
    refresh,
    savePrice,
    deletePrice
  }
}

