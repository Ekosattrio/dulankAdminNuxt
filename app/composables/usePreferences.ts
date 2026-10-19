import { ref } from 'vue'
import type { PreferenceItem } from '#server/types/preference-setting'

export function usePreferences() {
  const preferences = ref<PreferenceItem[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchPreferences() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: { group: string; values: { items?: PreferenceItem[] } } }>('/api/v1/admin/settings/preferences')
      if (res?.data) {
        preferences.value = res.data.values?.items ?? []
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch preferences'
    } finally {
      pending.value = false
    }
  }

  async function savePreferences(payload: PreferenceItem[]) {
    pending.value = true
    try {
      const res = await apiFetch<{ success: boolean; data: { group: string; values: { items?: PreferenceItem[] } } }>('/api/v1/admin/settings/preferences', {
        method: 'PUT',
        body: { items: payload }
      })
      preferences.value = payload
      return payload
    } catch (err: any) {
      error.value = err.message || 'Failed to save preferences'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchPreferences()

  return {
    preferences,
    pending,
    error,
    refresh: fetchPreferences,
    savePreferences
  }
}

