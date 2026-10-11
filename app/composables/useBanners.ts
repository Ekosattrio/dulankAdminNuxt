import type { BannerItem, BannerFormData } from '#server/types/banner'

interface ResponseData {
  success: boolean
  data: BannerItem[]
  message?: string
}

export function useBanners() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/banners', {
    key: 'banners-list'
  })

  const banners = computed<BannerItem[]>(() => data.value?.data ?? [])

  const saveBanner = async (payload: BannerFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<{ success: boolean; data: BannerItem; message?: string }>(
      id ? `/api/v1/admin/banners/${encodeURIComponent(id)}` : '/api/v1/admin/banners',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )
    await refresh()
    return res
  }

  const deleteBanner = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/banners/${encodeURIComponent(id)}`, {
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
