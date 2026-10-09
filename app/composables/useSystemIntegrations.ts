import type { SystemIntegrations, SystemIntegrationsResponse } from '#server/types/system-integrations'

export function useSystemIntegrations() {
  const { data: response, pending, error, refresh } = useFetch<SystemIntegrationsResponse>('/api/settings/system-integrations', {
    key: 'system-integrations-data',
    lazy: false
  })

  const integrations = computed(() => response.value?.data || {
    captcha: { enabled: true, siteKey: '', secretKey: '' },
    analytics: { enabled: true, trackingId: '' },
    adsense: { enabled: false, code: '' },
    map: { enabled: true, mapId: '' }
  })

  async function updateIntegrations(payload: Partial<SystemIntegrations>) {
    const res = await $fetch<SystemIntegrationsResponse>('/api/settings/system-integrations', {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    integrations,
    pending,
    error,
    refresh,
    updateIntegrations
  }
}

