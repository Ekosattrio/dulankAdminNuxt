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

  // No SMTP transport is configured yet; keep this result explicit for the UI.
  const result: TestEmailResult = {
    success: true,
    simulated: true,
    message: `Simulasi konfigurasi email berhasil untuk ${targetEmail} via ${currentConfig?.mailHost || 'SMTP Server'} (Port ${currentConfig?.mailPort || 587}). Belum ada email yang dikirim.`,
    sentTo: targetEmail,
    timestamp: new Date().toISOString(),
  }

  return {
    success: true,
    data: result,
    message: result.message,
  }
})
