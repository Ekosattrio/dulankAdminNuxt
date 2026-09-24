import { readJSON, writeJSON } from '~/server/utils/data'
import type { CalendarConfig } from '~/types/calendar-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CalendarConfig>>(event)
  const current = readJSON<CalendarConfig>('calendar-settings.json')

  const updated: CalendarConfig = {
    ...current,
    ...body
  }

  writeJSON('calendar-settings.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Calendar settings updated successfully'
  }
})

