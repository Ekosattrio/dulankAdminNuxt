import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { AppearanceSetting } from '~~/server/types/appearance-setting'

export default defineEventHandler(async () => {
  try {
    const data = await readJSON<AppearanceSetting>('appearance-settings.json', {
      theme: 'Light',
      accent: 'orange',
      expandSidebar: true,
      sidebarSize: 'Large - 250px',
      fontFamily: 'Nunito'
    })
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load appearance settings'
    }
  }
})

