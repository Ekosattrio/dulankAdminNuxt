import type { OtpConfig } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: { group: string; values: OtpConfig }
  message?: string
}

export function useOtpSettings() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/settings/otp', {
    key: 'otp-settings-data',
  })

  const otpConfig = computed<OtpConfig>(() => data.value?.data?.values ?? {
    isEnabled: true,
    provider: 'whatsapp',
    otpType: 'numeric',
    digitLimit: 6,
    expireMinutes: 5,
    resendDelaySeconds: 60,
  })

  const saveSettings = async (payload: Partial<OtpConfig>) => {
    const res = await apiFetch<{ success: boolean; data: OtpConfig; message?: string }>('/api/v1/admin/settings/otp', {
      method: 'PUT',
      body: payload,
    })
    await refresh()
    return res
  }

  return {
    otpConfig,
    pending,
    error,
    refresh,
    saveSettings,
  }
}
