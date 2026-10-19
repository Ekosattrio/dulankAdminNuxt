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

interface MutationResponse {
  success: boolean
  data?: ProductProcessItem
  message?: string
}

const EMPTY_STATS = { totalProduct: 0, totalProcess: 0, active: 0, deactive: 0 }

/**
 * Proses produk — backend Laravel `/api/v1/admin/product-processes`.
 * Backend tidak menyediakan stats agregat; UI memakai fallback nol.
 */
export function useProductProcesses(filterParams?: Ref<ProductProcessFilterParams> | ProductProcessFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    processName: params.value.processName || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/product-processes', {
    key: 'product-processes-list',
    query
  })

  const items = computed<ProductProcessItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? EMPTY_STATS)

  const saveProcess = async (payload: ProductProcessFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/product-processes/${encodeURIComponent(id)}` : '/api/v1/admin/product-processes',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteProcess = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/product-processes/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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