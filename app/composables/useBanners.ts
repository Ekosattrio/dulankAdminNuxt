import type { BannerItem, BannerFormData } from '#server/types/banner'

interface ResponseData {
  success: boolean
  data: BannerItem[]
  message?: string
}

export function useBanners() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/banners', {
    key: 'banners-list'
  })

  const banners = computed<BannerItem[]>(() => data.value?.data ?? [])

  const saveBanner = async (payload: BannerFormData) => {
    const res = await $fetch<{ success: boolean; data: BannerItem; message?: string }>('/api/banners', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteBanner = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/banners/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    banners,
    pending,
    error,
    refresh,
    saveBanner,
    deleteBanner
  }
}
