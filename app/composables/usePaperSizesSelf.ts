import type { PaperSize, PaperSizeFormData, PaperSizeFilterParams } from '#server/types/paper-shop'

interface ResponseData {
  success: boolean
  data: PaperSize[]
  stats: {
    total: number
    active: number
    deactive: number
  }
}

export function usePaperSizesSelf(filterParams?: Ref<PaperSizeFilterParams> | PaperSizeFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/paper-sizes', {
    key: 'paper-sizes-self-list',
    query: params
  })

  const sizes = computed<PaperSize[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { total: 0, active: 0, deactive: 0 })

  const saveSize = async (payload: PaperSizeFormData) => {
    const res = await $fetch<{ success: boolean; data: PaperSize; message?: string }>('/api/paper-sizes', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteSize = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/paper-sizes/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    sizes,
    stats,
    pending,
    error,
    refresh,
    saveSize,
    deleteSize
  }
}

