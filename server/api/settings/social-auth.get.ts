import { defineEventHandler } from 'h3'
import { readJSON } from '#server/utils/data'
import type { SocialAuthConfig } from '#server/types/social-auth'

const FILE_NAME = 'social-auth.json'

export default defineEventHandler(async () => {
  const data = readJSON<SocialAuthConfig>(FILE_NAME, {
    facebook: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    twitter: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    google: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    linkedin: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' }
  })

  return {
    success: true,
    data
  }
})

