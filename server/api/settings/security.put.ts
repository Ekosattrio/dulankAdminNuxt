import { defineEventHandler, readBody } from 'h3'
import { writeJSON, readJSON } from '#server/utils/data'
import type { SecuritySettings } from '#server/types/security-settings'

const FILE_NAME = 'security-settings.json'

export default defineEventHandler(async (event) => {
  const current = readJSON<SecuritySettings>(FILE_NAME, {
    passwordLastChanged: '22 July 2023, 10:30 AM',
    twoFactor: true,
    googleAuth: true,
    phone: '+6281234567890',
    email: 'admin@dulank.com',
    devices: [],
    activities: []
  })

  const body = await readBody<Partial<SecuritySettings>>(event)
  const merged: SecuritySettings = {
    ...current,
    ...body
  }
  writeJSON(FILE_NAME, merged)

  return {
    success: true,
    data: merged,
    message: 'Pengaturan keamanan berhasil diperbarui'
  }
})

