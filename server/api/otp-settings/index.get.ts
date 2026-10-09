import { getOtpConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const config = getOtpConfig()

  return {
    success: true,
    data: config,
  }
})
