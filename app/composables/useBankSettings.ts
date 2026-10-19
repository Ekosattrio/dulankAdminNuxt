import { ref } from 'vue'
import type { BankSetting } from '#server/types/bank-setting'

const GROUP = 'bank'

interface ListSettingPayload {
  success: boolean
  data: { group: string; values: Record<string, unknown> }
}

function readItems(payload: { group: string; values: Record<string, unknown> } | undefined): BankSetting[] {
  const value = payload?.values?.items
  return Array.isArray(value) ? (value as unknown as BankSetting[]) : []
}

/**
 * Pengaturan bank (list item) — backend Laravel `settings/{group}`
 * dengan kunci `items` (nilai JSON).
 */
export function useBankSettings() {
  const items = ref<BankSetting[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const syncItems = async (next: BankSetting[]) => {
    await apiFetch<{ success: boolean }>(`/api/v1/admin/settings/${GROUP}`, {
      method: 'PUT',
      body: { items: next },
    })
    items.value = next
  }

  async function fetchItems() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<ListSettingPayload>(`/api/v1/admin/settings/${GROUP}`)
      items.value = readItems(res?.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bank settings'
    } finally {
      pending.value = false
    }
  }

  async function saveItem(payload: Partial<BankSetting>) {
    pending.value = true
    try {
      const next = [...items.value]
      if (payload.id) {
        const idx = next.findIndex(item => item.id === payload.id)
        if (idx !== -1) next[idx] = { ...next[idx], ...payload } as BankSetting
      } else {
        next.push({
          id: String(Date.now()),
          ...payload,
        } as BankSetting)
      }
      await syncItems(next)
      return next[next.length - 1]
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
      await syncItems(items.value.filter(item => item.id !== id))
    } catch (err: any) {
      error.value = err.message || 'Failed to delete bank'
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
