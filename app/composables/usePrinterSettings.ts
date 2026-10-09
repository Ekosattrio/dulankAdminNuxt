import type { PrinterSetting } from '#server/types/printer-setting'

export function usePrinterSettings() {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: PrinterSetting[] }>('/api/printer-settings', {
    key: 'printer-settings-list',
    lazy: false
  })

  const items = computed<PrinterSetting[]>(() => response.value?.data || [])

  async function saveItem(payload: Partial<PrinterSetting>) {
    const res = await apiFetch<{ success: boolean; data: PrinterSetting }>('/api/printer-settings', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res.data
  }

  async function deleteItem(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/printer-settings/${id}`, {
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


