import type { SecuritySettings, SecuritySettingsResponse } from '#server/types/security-settings'

export function useSecuritySettings() {
  const { data: response, pending, error, refresh } = useFetch<SecuritySettingsResponse>('/api/settings/security', {
    key: 'security-settings-data',
    lazy: false
  })

  const security = computed(() => response.value?.data || {
    passwordLastChanged: '22 July 2023, 10:30 AM',
    twoFactor: true,
    googleAuth: true,
    phone: '+6281234567890',
    email: 'admin@dulank.com',
    devices: [],
    activities: []
  })

  async function updateSecurity(payload: Partial<SecuritySettings>) {
    const res = await $fetch<SecuritySettingsResponse>('/api/settings/security', {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    security,
    pending,
    error,
    refresh,
    updateSecurity
  }
}

