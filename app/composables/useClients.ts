import type { ClientItem, ClientFormData } from '#server/types/client'

interface ResponseData {
  success: boolean
  data: ClientItem[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: ClientItem
  message?: string
}

/**
 * Klien (logo klien) — backend Laravel `/api/v1/admin/clients`.
 */
export function useClients() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/clients', {
    key: 'clients-list',
    query: { limit: 100 }
  })

  const clients = computed<ClientItem[]>(() => data.value?.data ?? [])

  const saveClient = async (payload: ClientFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/clients/${encodeURIComponent(id)}` : '/api/v1/admin/clients',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteClient = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/clients/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  const reorderClients = async (_orderedIds: string[]) => {
    void _orderedIds

    throw new Error('Urutan klien diatur lewat edit item; reorder massal belum didukung backend.')
  }

  return {
    clients,
    pending,
    error,
    refresh,
    saveClient,
    deleteClient,
    reorderClients
  }
}