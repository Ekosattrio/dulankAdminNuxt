import { readJSON, writeJSON } from '~/server/utils/data'
import type { EmailConfig } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<EmailConfig>>(event)
  const current = readJSON<EmailConfig>('email-settings.json', {
    mailHost: 'smtp.gmail.com',
    mailPort: 587,
    mailUsername: 'admin@kacetak.com',
    mailPassword: '',
    mailEncryption: 'tls',
    fromEmail: 'noreply@kacetak.com',
    fromName: 'Kacetak POS & Printing System',
    mailEngine: 'smtp',
    status: true,
  })

  const updated: EmailConfig = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  writeJSON('email-settings.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Konfigurasi Email berhasil disimpan.',
  }
})
