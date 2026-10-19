import type { FooterConfig } from '#server/types/footer'

interface ResponseData {
  success: boolean
  data: FooterConfig
  message?: string
}

export function useFooterConfig() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/footer', {
    key: 'footer-config-data'
  })

  const config = computed<FooterConfig>(() => data.value?.data ?? {
    judul: '',
    desc: '',
    copyright: '',
    infoKami: [],
    panduan: [],
    alamat: '',
    telepon: '',
    email: '',
    socials: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  })

  const saveConfig = async (payload: FooterConfig) => {
    const res = await apiFetch<{ success: boolean; data: FooterConfig; message?: string }>('/api/v1/admin/footer', {
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
