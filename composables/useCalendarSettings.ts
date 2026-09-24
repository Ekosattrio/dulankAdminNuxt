import type { CalendarConfig } from '#server/types/calendar-setting'

interface CalendarResponse {
  success: boolean
  data: CalendarConfig
}

export function useCalendarSettings() {
  const { data, pending, error, refresh } = useFetch<CalendarResponse>('/api/calendar-settings', {
    key: 'calendar-settings'
  })

  const config = computed<CalendarConfig | undefined>(() => data.value?.data)

  const saveCalendarConfig = async (payload: CalendarConfig) => {
    const res = await $fetch<{ success: boolean; data: CalendarConfig; message?: string }>('/api/calendar-settings', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    config,
    pending,
    error,
    refresh,
    saveCalendarConfig
  }
}
