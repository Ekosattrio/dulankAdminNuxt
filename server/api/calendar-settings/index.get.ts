import { readJSON } from '~/server/utils/data'
import type { CalendarConfig } from '~/types/calendar-setting'

export default defineEventHandler(async () => {
  const config = readJSON<CalendarConfig>('calendar-settings.json')

  return {
    success: true,
    data: config
  }
})

