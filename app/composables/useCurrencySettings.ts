import { ref } from 'vue'
import type { CurrencySetting } from '#server/types/currency-setting'

const GROUP = 'currency'

interface ListSettingPayload {
  success: boolean
  data: { group: string; values: Record<string, unknown> }
}

function readItems(payload: { group: string; values: Record<string, unknown> } | undefined): CurrencySetting[] {
  const value = payload?.values?.items
  return Array.isArray(value) ? (value as unknown as CurrencySetting[]) : []
}

/**
 * Pengaturan mata uang (list item) — backend Laravel `settings/{group}`
 * dengan kunci `items` (nilai JSON).
 */
export function useCurrencySettings() {
  const items = ref<CurrencySetting[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const syncItems = async (next: CurrencySetting[]) => {
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
      error.value = err.message || 'Failed to fetch mata uang settings'
    } finally {
      pending.value = false
    }
  }

  async function saveItem(payload: Partial<CurrencySetting>) {
    if (pending.value) throw new Error('Tunggu proses mata uang selesai.')
    pending.value = true
    error.value = null
    try {
      payload = { ...payload, code: payload.code?.trim().toUpperCase() }
      const next = items.value.map(item => ({ ...item, isDefault: payload.isDefault && item.id !== payload.id ? false : item.isDefault }))
      if (payload.id) {
        const idx = next.findIndex(item => item.id === payload.id)
        if (idx === -1) throw new Error('Mata uang tidak ditemukan. Muat ulang data.')
        next[idx] = { ...next[idx], ...payload } as CurrencySetting
      } else {
        next.push({
          id: String(Date.now()),
          ...payload,
        } as CurrencySetting)
      }
      await syncItems(next)
      return next.find(item => item.id === payload.id) ?? next[next.length - 1]
    } catch (err: any) {
      error.value = err?.data?.message || err.message || 'Failed to save mata uang setting'
      throw err
    } finally {
      pending.value = false
    }
  }

  async function deleteItem(id: string) {
    if (pending.value) throw new Error('Tunggu proses mata uang selesai.')
    pending.value = true
    error.value = null
    try {
      await syncItems(items.value.filter(item => item.id !== id))
    } catch (err: any) {
      error.value = err.message || 'Failed to delete mata uang'
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
