import { getSystemIntegrations } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = getSystemIntegrations()

  return {
    success: true,
    data,
  }
})
