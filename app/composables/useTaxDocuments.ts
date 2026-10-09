import type { InputTaxFormData, InputTaxView, OutputTaxFormData, OutputTaxView } from '#server/types/tax-document'
interface ResponseData<T> { success: boolean; data: T[] }
export function useInputTaxes() {
  const request = useApiFetch<ResponseData<InputTaxView>>('/api/input-taxes', { key: 'input-tax-list' })
  const items = computed(() => request.data.value?.data ?? [])
  async function save(payload: InputTaxFormData) { const result = await apiFetch<{ success: boolean; data: InputTaxView; message: string }>('/api/input-taxes', { method: 'POST', body: payload }); await request.refresh(); return result }
  return { items, pending: request.pending, error: request.error, refresh: request.refresh, save }
}
export function useOutputTaxes() {
  const request = useApiFetch<ResponseData<OutputTaxView>>('/api/output-taxes', { key: 'output-tax-list' })
  const items = computed(() => request.data.value?.data ?? [])
  async function save(payload: OutputTaxFormData) { const result = await apiFetch<{ success: boolean; data: OutputTaxView; message: string }>('/api/output-taxes', { method: 'POST', body: payload }); await request.refresh(); return result }
  async function remove(id: string) { const result = await apiFetch<{ success: boolean; message: string }>(`/api/output-taxes/${id}`, { method: 'DELETE' }); await request.refresh(); return result }
  return { items, pending: request.pending, error: request.error, refresh: request.refresh, save, remove }
}

