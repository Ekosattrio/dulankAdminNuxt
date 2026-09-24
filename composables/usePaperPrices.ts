import type { PaperPrice, PaperPriceFormData, PaperPriceFilterParams } from '#server/types/paper-price'

interface ResponseData {
  success: boolean
  data: PaperPrice[]
  message?: string
}

export function usePaperPrices(filterParams?: Ref<PaperPriceFilterParams> | PaperPriceFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/paper-prices', {
    key: 'paper-prices-list',
    query: params
  })

  const paperPrices = computed<PaperPrice[]>(() => data.value?.data ?? [])

  const savePaperPrice = async (payload: PaperPriceFormData) => {
    const res = await $fetch<{ success: boolean; data: PaperPrice; message?: string }>('/api/paper-prices', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePaperPrice = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/paper-prices/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    paperPrices,
    pending,
    error,
    refresh,
    savePaperPrice,
    deletePaperPrice
  }
}
