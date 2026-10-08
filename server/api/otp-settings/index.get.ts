import { readJSON } from '~/server/utils/data'
import type { OtpConfig } from '~/types/system-settings'

export default defineEventHandler(async () => {
  const config = readJSON<OtpConfig>('otp-settings.json', {
    isEnabled: true,
    provider: 'whatsapp',
    otpType: 'numeric',
    digitLimit: 6,
    expireMinutes: 5,
    resendDelaySeconds: 60,
  })

  return {
    success: true,
    data: config,
  }
})
