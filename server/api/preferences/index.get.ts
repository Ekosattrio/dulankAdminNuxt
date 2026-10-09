import { getPreferences } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  try {
    const items = getPreferences()
    return {
      success: true,
      data: items,
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load preferences',
      data: [],
    }
  }
})
