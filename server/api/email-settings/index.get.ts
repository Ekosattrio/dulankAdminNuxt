import { getEmailConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const config = getEmailConfig()

  return {
    success: true,
    data: config,
  }
})
