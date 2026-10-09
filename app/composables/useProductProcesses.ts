import type {
  ProductProcessItem,
  ProductProcessFormData,
  ProductProcessFilterParams
} from '#server/types/product-process'

interface ResponseData {
  success: boolean
  data: ProductProcessItem[]
  stats: {
    totalProduct: number
    totalProcess: number
    active: number
    deactive: number
  }
}

export function useProductProcesses(filterParams?: Ref<ProductProcessFilterParams> | ProductProcessFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/product-processes', {
    key: 'product-processes-list',
    query: params
  })

  const items = computed<ProductProcessItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { totalProduct: 0, totalProcess: 0, active: 0, deactive: 0 })

  const saveProcess = async (payload: ProductProcessFormData) => {
    const res = await $fetch<{ success: boolean; data: ProductProcessItem; message?: string }>('/api/product-processes', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteProcess = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/product-processes/${id}`, {
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
    saveProcess,
    deleteProcess
  }
}

