import type { CustomField, CustomFieldInput, CustomFieldResponse } from '#server/types/custom-fields'

export function useCustomFields() {
  const { data: response, pending, error, refresh } = useApiFetch<CustomFieldResponse>('/api/custom-fields', {
    key: 'custom-fields-data',
    lazy: false
  })

  const fields = computed(() => response.value?.data || [])

  async function addField(payload: CustomFieldInput) {
    const res = await apiFetch<{ success: boolean; data: CustomField; message?: string }>('/api/custom-fields', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function updateField(id: number, payload: Partial<CustomFieldInput>) {
    const res = await apiFetch<{ success: boolean; data: CustomField; message?: string }>(`/api/custom-fields/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteField(id: number) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/custom-fields/${id}`, {
      method: 'DELETE'
    })
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

