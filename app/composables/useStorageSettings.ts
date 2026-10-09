import { ref } from 'vue'
import type { StorageSetting } from '#server/types/storage-setting'

export function useStorageSettings() {
  const storage = ref<StorageSetting>({
    local: { enabled: true },
    aws: {
      enabled: false,
      accessKey: '',
      secretKey: '',
      bucketName: '',
      region: '',
      baseUrl: ''
    }
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: StorageSetting }>('/api/storage-settings')
      if (res && res.data) {
        storage.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch storage settings'
    } finally {
      pending.value = false
    }
  }

  async function saveSettings(payload: StorageSetting) {
    pending.value = true
    try {
      const res = await apiFetch<{ success: boolean; data: StorageSetting }>('/api/storage-settings', {
        method: 'POST',
        body: payload
      })
      storage.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save storage settings'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchSettings()

  return {
    storage,
    pending,
    error,
    refresh: fetchSettings,
    saveSettings
  }
}

