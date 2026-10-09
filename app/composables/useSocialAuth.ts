import type { SocialAuthConfig, SocialAuthResponse } from '#server/types/social-auth'

export function useSocialAuth() {
  const { data: response, pending, error, refresh } = useApiFetch<SocialAuthResponse>('/api/settings/social-auth', {
    key: 'social-auth-settings-data',
    lazy: false
  })

  const providers = computed(() => response.value?.data || {
    facebook: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    twitter: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    google: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    linkedin: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' }
  })

  async function updateProviders(payload: Partial<SocialAuthConfig>) {
    const res = await apiFetch<SocialAuthResponse>('/api/settings/social-auth', {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    providers,
    pending,
    error,
    refresh,
    updateProviders
  }
}

