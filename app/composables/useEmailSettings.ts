import type { EmailConfig, TestEmailPayload, TestEmailResult } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: EmailConfig
  message?: string
}

export function useEmailSettings() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/email-settings', {
    key: 'email-settings-data',
  })

  const emailConfig = computed<EmailConfig>(() => data.value?.data ?? {
    mailHost: 'smtp.gmail.com',
    mailPort: 587,
    mailUsername: '',
    mailPassword: '',
    mailEncryption: 'tls',
    fromEmail: '',
    fromName: '',
    mailEngine: 'smtp',
    status: true,
  })

  const saveSettings = async (payload: Partial<EmailConfig>) => {
    const res = await $fetch<{ success: boolean; data: EmailConfig; message?: string }>('/api/email-settings', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  const sendTestEmail = async (toEmail: string) => {
    const res = await $fetch<{ success: boolean; data: TestEmailResult; message: string }>('/api/email-settings/test', {
      method: 'POST',
      body: { toEmail } as TestEmailPayload,
    })
    return res
  }

  return {
    emailConfig,
    pending,
    error,
    refresh,
    saveSettings,
    sendTestEmail,
  }
}
