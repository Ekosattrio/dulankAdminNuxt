import { getUserProfile } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const profile = getUserProfile()
  return createResponse(profile, 'Data profil berhasil dimuat')
})
