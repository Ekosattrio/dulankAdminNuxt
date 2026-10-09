import { defineEventHandler, readBody } from 'h3'
import { writeJSON, readJSON } from '#server/utils/data'
import type { SocialAuthConfig } from '#server/types/social-auth'

const FILE_NAME = 'social-auth.json'

export default defineEventHandler(async (event) => {
  const current = readJSON<SocialAuthConfig>(FILE_NAME, {
    facebook: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    twitter: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    google: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    linkedin: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' }
  })

  const body = await readBody<Partial<SocialAuthConfig>>(event)
  const merged: SocialAuthConfig = {
    ...current,
    ...body
  }
  writeJSON(FILE_NAME, merged)

  return {
    success: true,
    data: merged,
    message: 'Pengaturan otentikasi sosial berhasil diperbarui'
  }
})

