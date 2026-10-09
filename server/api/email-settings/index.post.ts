import type { EmailConfig } from '#server/types/system-settings'
import { saveEmailConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<EmailConfig>>(event)
  const updated = saveEmailConfig(body || {})

  return {
    success: true,
    data: updated,
    message: 'Konfigurasi Email berhasil disimpan.',
  }
})
