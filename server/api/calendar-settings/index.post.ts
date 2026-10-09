import type { CalendarConfig } from '~/types/calendar-setting'
import { updateCalendarConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CalendarConfig>>(event)
  const updated = await updateCalendarConfig(body)

  return {
    success: true,
    data: updated,
    message: 'Calendar settings updated successfully',
  }
})
