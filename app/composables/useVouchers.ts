import type { VoucherCommand, VoucherMeta, VoucherQuery, VoucherRecord } from '#server/types/voucher'

interface ListResponse { success: boolean; data: VoucherRecord[]; meta: VoucherMeta }
const emptyMeta: VoucherMeta = { stores: [], products: [], filterProducts: [], names: [] }
export function useVouchers(query: Ref<VoucherQuery>) {
  const { data, pending, error, refresh } = useApiFetch<ListResponse>('/api/vouchers', { key: 'vouchers-list', query })
  async function createVoucher(command: VoucherCommand) {
    const response = await apiFetch<{ success: boolean; data: VoucherRecord; message: string }>('/api/vouchers', { method: 'POST', body: command })
    await refresh(); return response
  }
  async function updateVoucher(id: string, command: VoucherCommand) {
    const response = await apiFetch<{ success: boolean; data: VoucherRecord; message: string }>(`/api/vouchers/${id}`, { method: 'PUT', body: command })
    await refresh(); return response
  }
  async function deleteVoucher(id: string) {
    const response = await apiFetch<{ success: boolean; data: VoucherRecord; message: string }>(`/api/vouchers/${id}`, { method: 'DELETE' })
    await refresh(); return response
  }
  return { vouchers: computed(() => data.value?.data ?? []), meta: computed(() => data.value?.meta ?? emptyMeta), pending, error, refresh, createVoucher, updateVoucher, deleteVoucher }
}
