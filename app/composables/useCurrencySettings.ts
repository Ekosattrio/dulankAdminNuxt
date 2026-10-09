import { ref } from 'vue'
import type { CurrencySetting } from '#server/types/currency-setting'

export function useCurrencySettings() {
  const items = ref<CurrencySetting[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    pending.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data: CurrencySetting[] }>('/api/currency-settings')
      if (res && res.data) {
        items.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch currency settings'
    } finally {
      pending.value = false
    }
  }

  async function saveItem(payload: Partial<CurrencySetting>) {
    pending.value = true
    try {
      const res = await $fetch<{ success: boolean; data: CurrencySetting }>('/api/currency-settings', {
        method: 'POST',
        body: payload
      })
      await fetchItems()
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save currency setting'
      throw err
    } finally {
      pending.value = false
    }
  }

  async function deleteItem(id: string) {
    pending.value = true
    try {
      await $fetch(`/api/currency-settings/${id}`, {
        method: 'DELETE'
      })
      await fetchItems()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete currency'
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

