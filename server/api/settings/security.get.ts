import { defineEventHandler } from 'h3'
import { readJSON } from '#server/utils/data'
import type { SecuritySettings } from '#server/types/security-settings'

const FILE_NAME = 'security-settings.json'

export default defineEventHandler(async () => {
  const data = readJSON<SecuritySettings>(FILE_NAME, {
    passwordLastChanged: '22 July 2023, 10:30 AM',
    twoFactor: true,
    googleAuth: true,
    phone: '+6281234567890',
    email: 'admin@dulank.com',
    devices: [],
    activities: []
  })

  return {
    success: true,
    data
  }
})

