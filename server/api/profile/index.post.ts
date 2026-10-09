import type { UserProfile } from '#server/types/profile'
import { saveUserProfile } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<UserProfile>>(event)
  const updatedProfile = saveUserProfile(body)
  return createResponse(updatedProfile, 'Data profil berhasil diperbarui')
})
