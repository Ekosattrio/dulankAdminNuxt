import type { CurrencySetting } from '#server/types/currency-setting'

export function useCurrencySettings() {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: CurrencySetting[] }>('/api/currency-settings', {
    key: 'currency-settings-list',
    lazy: false
  })

  const items = computed<CurrencySetting[]>(() => response.value?.data || [])

  async function saveItem(payload: Partial<CurrencySetting>) {
    const res = await apiFetch<{ success: boolean; data: CurrencySetting }>('/api/currency-settings', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res.data
  }

  async function deleteItem(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/currency-settings/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    items,
    pending,
    error,
    refresh,
    saveItem,
    deleteItem
  }
}


