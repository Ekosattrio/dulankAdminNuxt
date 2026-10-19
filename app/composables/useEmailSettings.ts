import type { EmailConfig, TestEmailPayload, TestEmailResult } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: { group: string; values: EmailConfig }
  message?: string
}

export function useEmailSettings() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/settings/email', {
    key: 'email-settings-data',
  })

  const emailConfig = computed<EmailConfig>(() => data.value?.data?.values ?? {
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
    const res = await apiFetch<{ success: boolean; data: EmailConfig; message?: string }>('/api/v1/admin/settings/email', {
      method: 'PUT',
      body: payload,
    })
    await refresh()
    return res
  }

  const sendTestEmail = async (toEmail: string) => {
    const res = await apiFetch<{ success: boolean; data: TestEmailResult; message: string }>('/api/v1/admin/settings/email/test', {
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
