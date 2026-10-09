import type { OtpConfig } from '#server/types/system-settings'
import { saveOtpConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<OtpConfig>>(event)
  const updated = saveOtpConfig(body || {})

  return {
    success: true,
    data: updated,
    message: 'Konfigurasi OTP berhasil disimpan.',
  }
})
