import type { FooterConfig } from '#server/types/footer'

interface ResponseData {
  success: boolean
  data: FooterConfig
  message?: string
}

export function useFooterConfig() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/footer-config', {
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
    const res = await apiFetch<{ success: boolean; data: FooterConfig; message?: string }>('/api/footer-config', {
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
    saveConfig
  }
}
