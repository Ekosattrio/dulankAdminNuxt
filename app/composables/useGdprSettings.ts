import { ref } from 'vue'
import type { GdprSetting } from '#server/types/gdpr-setting'

export function useGdprSettings() {
  const form = ref<GdprSetting>({
    consentText: '',
    position: 'Right',
    agreeText: 'Agree',
    declineText: 'Decline',
    showDecline: true,
    policyLink: ''
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: GdprSetting }>('/api/gdpr-settings')
      if (res && res.data) {
        form.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch GDPR settings'
    } finally {
      pending.value = false
    }
  }

  async function saveSettings(payload: GdprSetting) {
    pending.value = true
    try {
      const res = await apiFetch<{ success: boolean; data: GdprSetting }>('/api/gdpr-settings', {
        method: 'POST',
        body: payload
      })
      form.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save GDPR settings'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchSettings()

  return {
    form,
    pending,
    error,
    refresh: fetchSettings,
    saveSettings
  }
}

