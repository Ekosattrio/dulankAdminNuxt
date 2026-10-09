import { getSmsGateways } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  try {
    const data = getSmsGateways()
    return {
      success: true,
      data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load SMS gateways',
    }
  }
})
