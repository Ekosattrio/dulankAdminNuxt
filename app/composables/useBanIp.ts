import type { BanIpItem, BanIpInput } from '#server/types/ban-ip'

interface BanIpRow {
  id: number | string
  ip: string | null
  reason: string | null
  status: string | boolean
  created: string | null
}

interface BanIpListResponse {
  success: boolean
  data: BanIpRow[]
  message?: string
}

const RELIST = '/api/v1/admin/ban-ips'

/**
 * Daftar IP terblokir — backend Laravel `/api/v1/admin/ban-ips`.
 * Payload backend memakai `status` string (Active/Inactive) dan `created`;
 * dipetakan ke bentuk admin (`status` boolean, `date`).
 */
export function useBanIp() {
  const { data: response, pending, error, refresh } = useApiFetch<BanIpListResponse>(RELIST, {
    key: 'ban-ip-data',
    lazy: false
  })

  const banList = computed<BanIpItem[]>(() =>
    (response.value?.data ?? []).map(item => ({
      id: Number(item.id) || 0,
      ip: item.ip ?? '',
      reason: item.reason ?? '',
      date: item.created ?? '',
      status: (item.status as never) === true || String(item.status) === 'Active',
    })),
  )

  async function addIp(payload: BanIpInput) {
    const res = await apiFetch<{ success: boolean; data: BanIpItem; message?: string }>(RELIST, {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function updateIp(id: number, payload: Partial<BanIpInput>) {
    const res = await apiFetch<{ success: boolean; data: BanIpItem; message?: string }>(
      `${RELIST}/${encodeURIComponent(String(id))}`,
      { method: 'PUT', body: payload }
    )
    await refresh()
    return res
  }

  async function deleteIp(id: number) {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `${RELIST}/${encodeURIComponent(String(id))}`,
      { method: 'DELETE' }
    )
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