import type { OtpConfig } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: OtpConfig
  message?: string
}

export function useOtpSettings() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/otp-settings', {
    key: 'otp-settings-data',
  })

  const otpConfig = computed<OtpConfig>(() => data.value?.data ?? {
    isEnabled: true,
    provider: 'whatsapp',
    otpType: 'numeric',
    digitLimit: 6,
    expireMinutes: 5,
    resendDelaySeconds: 60,
  })

  const saveSettings = async (payload: Partial<OtpConfig>) => {
    const res = await $fetch<{ success: boolean; data: OtpConfig; message?: string }>('/api/otp-settings', {
      method: 'POST',
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
