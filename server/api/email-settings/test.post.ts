import { readJSON } from '~/server/utils/data'
import type { EmailConfig, TestEmailPayload, TestEmailResult } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const body = await readBody<TestEmailPayload & { to?: string }>(event)
  const targetEmail = body?.toEmail || body?.to

  if (!targetEmail || !targetEmail.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Harap masukkan alamat email tujuan yang valid.',
    })
  }

  const currentConfig = readJSON<EmailConfig>('email-settings.json')

  // Mock test email delivery simulation
  const result: TestEmailResult = {
    success: true,
    message: `Test email berhasil dikirim ke ${targetEmail} via ${currentConfig?.mailHost || 'SMTP Server'} (Port ${currentConfig?.mailPort || 587}).`,
    sentTo: targetEmail,
    timestamp: new Date().toISOString(),
  }

  return {
    success: true,
    data: result,
    message: result.message,
  }
})
