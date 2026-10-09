import { readJSON } from '~/server/utils/data'
import type { EmailConfig } from '~/types/system-settings'

export default defineEventHandler(async () => {
  const config = readJSON<EmailConfig>('email-settings.json', {
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

  return {
    success: true,
    data: config,
  }
})
