import { ref } from 'vue'
import type { PrinterSetting } from '#server/types/printer-setting'

export function usePrinterSettings() {
  const items = ref<PrinterSetting[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    pending.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data: PrinterSetting[] }>('/api/printer-settings')
      if (res && res.data) {
        items.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch printer settings'
    } finally {
      pending.value = false
    }
  }

  async function saveItem(payload: Partial<PrinterSetting>) {
    pending.value = true
    try {
      const res = await $fetch<{ success: boolean; data: PrinterSetting }>('/api/printer-settings', {
        method: 'POST',
        body: payload
      })
      await fetchItems()
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save printer setting'
      throw err
    } finally {
      pending.value = false
    }
  }

  async function deleteItem(id: string) {
    pending.value = true
    try {
      await $fetch(`/api/printer-settings/${id}`, {
        method: 'DELETE'
      })
      await fetchItems()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete printer'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchItems()

  return {
    items,
    pending,
    error,
    refresh: fetchItems,
    saveItem,
    deleteItem
  }
}

