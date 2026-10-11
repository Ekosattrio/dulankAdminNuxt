import type { CalendarConfig } from '#server/types/calendar-setting'

interface CalendarResponse {
  success: boolean
  data: { group: string; values: CalendarConfig }
}

export function useCalendarSettings() {
  const { data, pending, error, refresh } = useApiFetch<CalendarResponse>('/api/v1/admin/settings/calendar', {
    key: 'calendar-settings'
  })

  const config = computed<CalendarConfig | undefined>(() => data.value?.data?.values as CalendarConfig | undefined)

  const saveCalendarConfig = async (payload: CalendarConfig) => {
    const res = await apiFetch<{ success: boolean; data: CalendarConfig; message?: string }>('/api/v1/admin/settings/calendar', {
      method: 'PUT',
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
