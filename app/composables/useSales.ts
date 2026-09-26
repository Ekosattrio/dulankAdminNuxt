import type { Sale, SaleFormData, SaleFilterParams } from '#server/types/sale'

interface ResponseData {
  success: boolean
  data: Sale[]
  message?: string
}

export function useSales(filterParams?: Ref<SaleFilterParams> | SaleFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/sales', {
    key: 'sales-list',
    query: params
  })

  const sales = computed<Sale[]>(() => data.value?.data ?? [])

  const saveSale = async (payload: SaleFormData) => {
    const res = await $fetch<{ success: boolean; data: Sale; message?: string }>('/api/sales', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteSale = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/sales/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    sales,
    pending,
    error,
    refresh,
    saveSale,
    deleteSale
  }
}
