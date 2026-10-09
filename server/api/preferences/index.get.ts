import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { PreferenceItem } from '~~/server/types/preference-setting'

export default defineEventHandler(async () => {
  try {
    const items = await readJSON<PreferenceItem[]>('preference-settings.json', [])
    return {
      success: true,
      data: items
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load preferences',
      data: []
    }
  }
})

