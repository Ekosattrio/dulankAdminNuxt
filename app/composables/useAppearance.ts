import { ref } from 'vue'
import type { AppearanceSetting } from '#server/types/appearance-setting'

export function useAppearance() {
  const settings = ref<AppearanceSetting>({
    theme: 'Light',
    accent: 'orange',
    expandSidebar: true,
    sidebarSize: 'Large - 250px',
    fontFamily: 'Nunito'
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    pending.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data: AppearanceSetting }>('/api/appearance')
      if (res && res.data) {
        settings.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch appearance settings'
    } finally {
      pending.value = false
    }
  }

  async function saveSettings(payload: AppearanceSetting) {
    pending.value = true
    try {
      const res = await $fetch<{ success: boolean; data: AppearanceSetting }>('/api/appearance', {
        method: 'POST',
        body: payload
      })
      settings.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save appearance settings'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchSettings()

  return {
    settings,
    pending,
    error,
    refresh: fetchSettings,
    saveSettings
  }
}

