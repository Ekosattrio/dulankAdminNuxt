import type { BankSetting } from '#server/types/bank-setting'

export function useBankSettings() {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: BankSetting[] }>('/api/bank-settings', {
    key: 'bank-settings-list',
    lazy: false
  })

  const items = computed<BankSetting[]>(() => response.value?.data || [])

  async function saveItem(payload: Partial<BankSetting>) {
    const res = await apiFetch<{ success: boolean; data: BankSetting }>('/api/bank-settings', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res.data
  }

  async function deleteItem(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/bank-settings/${id}`, {
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


