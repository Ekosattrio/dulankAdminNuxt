import type { SecuritySettings } from '#server/types/security-settings'
import { saveSecuritySettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SecuritySettings>>(event)
  const merged = saveSecuritySettings(body || {})

  return {
    success: true,
    data: merged,
    message: 'Pengaturan keamanan berhasil diperbarui',
  }
})
