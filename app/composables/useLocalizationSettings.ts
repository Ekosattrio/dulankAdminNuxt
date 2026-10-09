import type { LocalizationConfig } from '#server/types/system-settings'

export function useLocalizationSettings() {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: LocalizationConfig }>('/api/settings/localization', {
    key: 'localization-settings',
    lazy: false
  })

  const config = computed(() => response.value?.data || {
    language: 'Indonesian',
    languageSwitcher: true,
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '24 Hours',
    financialYear: '2026',
    startingMonth: 'January',
    currency: 'IDR',
    currencySymbol: 'Rp',
    currencyPosition: 'before',
    decimalSeparator: ',',
    thousandSeparator: '.',
    countriesRestriction: 'Allow All Countries',
    allowedFiles: 'JPG, GIF, PNG, PDF, ZIP, SVG',
    maxFileSize: 5000
  })

  async function saveConfig(payload: LocalizationConfig) {
    const res = await apiFetch<{ success: boolean; data: LocalizationConfig; message: string }>('/api/settings/localization', {
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
    saveConfig
  }
}

