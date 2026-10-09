import type { CashAdvanceFormData, CashAdvanceView } from '#server/types/cash-advance'
interface ResponseData { success: boolean; data: CashAdvanceView[] }
export function useCashAdvances() {
  const request = useApiFetch<ResponseData>('/api/cash-advances', { key: 'cash-advance-list' })
  const items = computed<CashAdvanceView[]>(() => request.data.value?.data ?? [])
  async function save(payload: CashAdvanceFormData) {
    const result = await apiFetch<{ success: boolean; data: CashAdvanceView; message: string }>('/api/cash-advances', { method: 'POST', body: payload })
    await request.refresh(); return result
  }
  async function remove(id: string) {
    const result = await apiFetch<{ success: boolean; message: string }>(`/api/cash-advances/${id}`, { method: 'DELETE' })
    await request.refresh(); return result
  }
  return { items, pending: request.pending, error: request.error, refresh: request.refresh, save, remove }
}

