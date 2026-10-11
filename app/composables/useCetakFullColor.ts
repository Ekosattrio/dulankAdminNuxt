import type { CetakFullColorConfig } from '#server/types/cetak-full-color'

interface CetakResponse {
  success: boolean
  data: CetakFullColorConfig
}

export function useCetakFullColor() {
  const { data, pending, error, refresh } = useApiFetch<CetakResponse>('/api/v1/admin/products', {
    key: 'cetak-full-color'
  })

  const config = computed<CetakFullColorConfig | undefined>(() => data.value?.data)

  const saveCetakFullColorConfig = async (payload: Partial<CetakFullColorConfig>) => {
    const res = await apiFetch<{ success: boolean; data: CetakFullColorConfig; message?: string }>('/api/v1/admin/products', {
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
    saveCetakFullColorConfig
  }
}
