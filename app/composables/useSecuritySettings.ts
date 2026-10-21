import type { SecuritySettings, SecuritySettingsResponse } from '#server/types/security-settings'
import type { PasswordChangePayload } from '#server/types/profile'

export function useSecuritySettings() {
  const { data: response, pending, error, refresh } = useApiFetch<SecuritySettingsResponse>('/api/v1/admin/account/security', { key: 'security-settings-data' })
  const security = computed<SecuritySettings>(() => response.value?.data ?? { passwordLastChanged: '', twoFactor: false, googleAuth: false, phone: '', email: '', devices: [], activities: [] })
  async function updateSecurity(payload: Partial<SecuritySettings>) {
    const result = await apiFetch<SecuritySettingsResponse>('/api/v1/admin/account/security', { method: 'PUT', body: payload })
    await refresh()
    return result
  }
  async function changePassword(payload: PasswordChangePayload) {
    await apiFetch('/api/v1/admin/profile/password', { method: 'PUT', body: { current_password: payload.currentPassword, password: payload.newPassword, password_confirmation: payload.confirmPassword } })
    await refresh()
  }
  async function setupTwoFactor(password: string) {
    const result = await apiFetch<{ data: { secret: string; otpauthUrl: string } }>('/api/v1/admin/account/two-factor/setup', { method: 'POST', body: { password } })
    return result.data
  }
  async function confirmTwoFactor(code: string) {
    await apiFetch('/api/v1/admin/account/two-factor/confirm', { method: 'POST', body: { code } })
    await refresh()
  }
  async function disableTwoFactor(password: string) {
    await apiFetch('/api/v1/admin/account/two-factor', { method: 'DELETE', body: { password } })
    await refresh()
  }
  return { security, pending, error, refresh, updateSecurity, changePassword, setupTwoFactor, confirmTwoFactor, disableTwoFactor }
}
