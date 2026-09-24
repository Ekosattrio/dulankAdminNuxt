import type { PaperSize, PaperSizeFormData, PaperSizeFilterParams } from '#server/types/paper-size'

interface ResponseData {
  success: boolean
  data: PaperSize[]
  message?: string
}

export function usePaperSizes(filterParams?: Ref<PaperSizeFilterParams> | PaperSizeFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/paper-sizes', {
    key: 'paper-sizes-list',
    query: params
  })

  const paperSizes = computed<PaperSize[]>(() => data.value?.data ?? [])

  const savePaperSize = async (payload: PaperSizeFormData) => {
    const res = await $fetch<{ success: boolean; data: PaperSize; message?: string }>('/api/paper-sizes', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePaperSize = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/paper-sizes/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    paperSizes,
    pending,
    error,
    refresh,
    savePaperSize,
    deletePaperSize
  }
}
