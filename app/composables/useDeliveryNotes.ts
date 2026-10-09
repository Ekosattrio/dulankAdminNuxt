import type { DeliveryNote, DeliveryNoteFormData, DeliveryNoteFilterParams } from '#server/types/delivery-note'

interface ResponseData {
  success: boolean
  data: DeliveryNote[]
  message?: string
}

export function useDeliveryNotes(filterParams?: Ref<DeliveryNoteFilterParams> | DeliveryNoteFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/delivery-notes', {
    key: 'delivery-notes-list',
    query: params
  })

  const deliveryNotes = computed<DeliveryNote[]>(() => data.value?.data ?? [])

  const saveDeliveryNote = async (payload: DeliveryNoteFormData) => {
    const res = await apiFetch<{ success: boolean; data: DeliveryNote; message?: string }>('/api/delivery-notes', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDeliveryNote = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/delivery-notes/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    deliveryNotes,
    pending,
    error,
    refresh,
    saveDeliveryNote,
    deleteDeliveryNote
  }
}
