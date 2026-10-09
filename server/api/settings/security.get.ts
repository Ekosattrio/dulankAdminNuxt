import { getSecuritySettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = getSecuritySettings()

  return {
    success: true,
    data,
  }
})
