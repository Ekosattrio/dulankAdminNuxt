import type { SocialAuthConfig } from '#server/types/social-auth'
import { saveSocialAuthSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SocialAuthConfig>>(event)
  const merged = saveSocialAuthSettings(body || {})

  return {
    success: true,
    data: merged,
    message: 'Pengaturan otentikasi sosial berhasil diperbarui',
  }
})
