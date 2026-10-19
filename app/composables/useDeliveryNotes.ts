import type { DeliveryNote, DeliveryNoteFormData, DeliveryNoteFilterParams } from '#server/types/delivery-note'

interface ResponseData {
  success: boolean
  data: DeliveryNote[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: DeliveryNote
  message?: string
}

/**
 * Surat Jalan (Delivery Note) — backend Laravel `/api/v1/admin/delivery-notes`.
 * Route mutasi memakai `{dnNo}`; `id` di-resolve dari list.
 * Payload tulis identik dengan tipe admin.
 */
export function useDeliveryNotes(filterParams?: Ref<DeliveryNoteFilterParams> | DeliveryNoteFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/delivery-notes', {
    key: 'delivery-notes-list',
    query
  })

  const deliveryNotes = computed<DeliveryNote[]>(() => data.value?.data ?? [])

  const resolveNo = (idOrNo: string): string => {
    return deliveryNotes.value.find(note => note.id === idOrNo || note.dnNo === idOrNo)?.dnNo ?? idOrNo
  }

  const saveDeliveryNote = async (payload: DeliveryNoteFormData) => {
    const { id, dnNo, ...body } = payload
    void dnNo

    const res = await apiFetch<MutationResponse>(
      id
        ? `/api/v1/admin/delivery-notes/${encodeURIComponent(resolveNo(id))}`
        : '/api/v1/admin/delivery-notes',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteDeliveryNote = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/delivery-notes/${encodeURIComponent(resolveNo(id))}`,
      { method: 'DELETE' }
    )

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