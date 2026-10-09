import type { Voucher, VoucherFormData } from '#server/types/promo'

export function useVouchers(filterParams?: Ref<{ search?: string; type?: string; status?: string } | undefined>) {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: Voucher[]; message?: string }>('/api/vouchers', {
    key: 'vouchers-data',
    query: filterParams,
    lazy: false
  })

  const vouchers = computed<Voucher[]>(() => response.value?.data || [])

  async function saveVoucher(payload: VoucherFormData) {
    const res = await apiFetch<{ success: boolean; data: Voucher; message?: string }>('/api/vouchers', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteVoucher(id: string | number) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/vouchers/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    vouchers,
    pending,
    error,
    refresh,
    saveVoucher,
    deleteVoucher
  }
}

