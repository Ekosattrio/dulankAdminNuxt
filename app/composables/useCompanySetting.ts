import type { CompanySetting, CompanySettingUpdatePayload } from '#server/types/company-setting'

interface CompanySettingApiResponse {
  success: boolean
  data: CompanySetting
  message?: string
}

export function useCompanySetting() {
  const { data, pending, error, refresh } = useFetch<CompanySettingApiResponse>('/api/company-setting', {
    key: 'company-setting-data'
  })

  const companySetting = computed<CompanySetting>(() => data.value?.data ?? {
    id: '',
    companyName: '',
    tagline: '',
    email: '',
    phone: '',
    fax: '',
    website: '',
    npwp: '',
    currency: 'IDR',
    address: '',
    country: 'Indonesia',
    province: '',
    city: '',
    postalCode: '',
    images: {
      logo: '/assets/img/logo-small.png',
      icon: '/assets/img/logo-small.png',
      favicon: '/assets/img/kacetak.jpeg',
      darkLogo: '/assets/img/logo-small.png'
    }
  })

  const saveCompanySetting = async (payload: CompanySettingUpdatePayload) => {
    const res = await $fetch<{ success: boolean; data: CompanySetting; message?: string }>('/api/company-setting', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    companySetting,
    pending,
    error,
    refresh,
    saveCompanySetting
  }
}
