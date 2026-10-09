import { ref, computed } from 'vue'
import type { BankSetting, BankSettingFormData } from '#server/types/bank-setting'

export function useBankSettings() {
  const items = ref<BankSetting[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: BankSetting[] }>('/api/bank-settings')
      if (res && res.data) {
        items.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bank settings'
    } finally {
      pending.value = false
    }
  }

  async function saveItem(payload: Partial<BankSetting>) {
    pending.value = true
    try {
      const res = await apiFetch<{ success: boolean; data: BankSetting }>('/api/bank-settings', {
        method: 'POST',
        body: payload
      })
      await fetchItems()
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save bank setting'
      throw err
    } finally {
      pending.value = false
    }
  }

  async function deleteItem(id: string) {
    pending.value = true
    try {
      await apiFetch(`/api/bank-settings/${id}`, {
        method: 'DELETE'
      })
      await fetchItems()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete bank setting'
      throw err
    } finally {
      pending.value = false
    }
  }

  // Initial fetch
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

