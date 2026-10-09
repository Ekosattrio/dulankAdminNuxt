import { getLocalizationSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const config = getLocalizationSettings()

  return {
    success: true,
    data: config,
  }
})
