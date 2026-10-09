import type { ClientItem, ClientFormData } from '#server/types/client'

interface ResponseData {
  success: boolean
  data: ClientItem[]
  message?: string
}

export function useClients() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/clients', {
    key: 'clients-list'
  })

  const clients = computed<ClientItem[]>(() => data.value?.data ?? [])

  const saveClient = async (payload: ClientFormData) => {
    const res = await apiFetch<{ success: boolean; data: ClientItem; message?: string }>('/api/clients', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteClient = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/clients/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  const reorderClients = async (orderedIds: string[]) => {
    const res = await apiFetch<{ success: boolean; data: ClientItem[]; message?: string }>('/api/clients/reorder', {
      method: 'POST',
      body: { order: orderedIds }
    })
    await refresh()
    return res
  }

  return {
    clients,
    pending,
    error,
    refresh,
    saveClient,
    deleteClient,
    reorderClients,
  }
}
