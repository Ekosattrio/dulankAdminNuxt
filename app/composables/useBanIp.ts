import type { BanIpItem, BanIpInput, BanIpResponse } from '#server/types/ban-ip'

export function useBanIp() {
  const { data: response, pending, error, refresh } = useFetch<BanIpResponse>('/api/settings/ban-ip', {
    key: 'ban-ip-data',
    lazy: false
  })

  const banList = computed(() => response.value?.data || [])

  async function addIp(payload: BanIpInput) {
    const res = await $fetch<{ success: boolean; data: BanIpItem; message?: string }>('/api/settings/ban-ip', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function updateIp(id: number, payload: Partial<BanIpInput>) {
    const res = await $fetch<{ success: boolean; data: BanIpItem; message?: string }>(`/api/settings/ban-ip/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteIp(id: number) {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/settings/ban-ip/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    banList,
    pending,
    error,
    refresh,
    addIp,
    updateIp,
    deleteIp
  }
}

