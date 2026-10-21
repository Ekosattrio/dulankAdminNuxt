import type { Store, StoreFormData } from '#server/types/store'

interface ResponseData {
  success: boolean
  data: Store[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Store
  message?: string
}

/**
 * Toko (Peoples) — backend Laravel `/api/v1/admin/stores`.
 */
export function useStores() {
  const query = { limit: 100 }

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/stores', {
    key: 'stores-list',
    query
  })

  const stores = computed<Store[]>(() => data.value?.data ?? [])

  const saveStore = async (payload: StoreFormData) => {
    const { id, ...body } = payload
    const { persistImage } = useImageUpload()
    if (body.photo !== undefined) body.photo = await persistImage(body.photo, 'stores')

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/stores/${encodeURIComponent(id)}` : '/api/v1/admin/stores',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteStore = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/stores/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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