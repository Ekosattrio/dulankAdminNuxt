import type { Store, StoreFormData } from '#server/types/store'

interface ResponseData {
  success: boolean
  data: Store[]
  message?: string
}

export function useStores() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/stores', {
    key: 'stores-list'
  })

  const stores = computed<Store[]>(() => data.value?.data ?? [])

  const saveStore = async (payload: StoreFormData) => {
    const res = await $fetch<{ success: boolean; data: Store; message?: string }>('/api/stores', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteStore = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/stores/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    stores,
    pending,
    error,
    refresh,
    saveStore,
    deleteStore
  }
}
