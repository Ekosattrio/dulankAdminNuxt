import type { CustomField, CustomFieldInput, CustomFieldResponse } from '#server/types/custom-fields'

/**
 * Custom field — backend Laravel `/api/v1/admin/custom-fields`.
 */
export function useCustomFields() {
  const { data: response, pending, error, refresh } = useApiFetch<CustomFieldResponse>('/api/v1/admin/custom-fields', {
    key: 'custom-fields-data',
    lazy: false
  })

  const fields = computed<CustomField[]>(() => response.value?.data || [])

  const addField = async (payload: CustomFieldInput) => {
    const res = await apiFetch<{ success: boolean; data: CustomField; message?: string }>('/api/v1/admin/custom-fields', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const updateField = async (id: string | number, payload: Partial<CustomFieldInput>) => {
    const res = await apiFetch<{ success: boolean; data: CustomField; message?: string }>(
      `/api/v1/admin/custom-fields/${encodeURIComponent(id)}`,
      { method: 'PUT', body: payload }
    )
    await refresh()
    return res
  }

  const deleteField = async (id: string | number) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/custom-fields/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )
    await refresh()
    return res
  }

  return {
    fields,
    pending,
    error,
    refresh,
    addField,
    updateField,
    deleteField
  }
}