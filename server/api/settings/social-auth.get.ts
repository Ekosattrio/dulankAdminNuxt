import { getSocialAuthSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = getSocialAuthSettings()

  return {
    success: true,
    data,
  }
})
