import { readJSON, writeJSON } from '~/server/utils/data'
import type { OtpConfig } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<OtpConfig>>(event)
  const current = readJSON<OtpConfig>('otp-settings.json', {
    isEnabled: true,
    provider: 'whatsapp',
    otpType: 'numeric',
    digitLimit: 6,
    expireMinutes: 5,
    resendDelaySeconds: 60,
  })

  const updated: OtpConfig = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  writeJSON('otp-settings.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Konfigurasi OTP berhasil disimpan.',
  }
})
