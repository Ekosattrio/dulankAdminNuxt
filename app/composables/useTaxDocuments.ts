import type { InputTaxFormData, InputTaxView, OutputTaxFormData, OutputTaxView } from '#server/types/tax-document'

interface ResponseData<T> {
  success: boolean
  data: T[]
}

interface MutationResponse {
  success: boolean
  data?: unknown
  message?: string
}

const INPUT_URL = '/api/v1/admin/input-taxes'
const OUTPUT_URL = '/api/v1/admin/output-taxes'

/**
 * Dokumen pajak masukan (faktur pajak pembelian) — backend
 * `/api/v1/admin/input-taxes` (GET/POST).
 */
export function useInputTaxes() {
  const request = useApiFetch<ResponseData<InputTaxView>>(INPUT_URL, {
    key: 'input-tax-list',
    query: { limit: 100 },
  })
  const items = computed(() => request.data.value?.data ?? [])

  async function save(payload: InputTaxFormData) {
    const result = await apiFetch<MutationResponse>(INPUT_URL, { method: 'POST', body: payload })
    await request.refresh()
    return result
  }

  return { items, pending: request.pending, error: request.error, refresh: request.refresh, save }
}

/**
 * Dokumen pajak keluaran (faktur pajak penjualan) — backend
 * `/api/v1/admin/output-taxes` (GET/POST/PUT). Pembatalan dilakukan lewat
 * update status (`Cancelled`), bukan hapus.
 */
export function useOutputTaxes() {
  const request = useApiFetch<ResponseData<OutputTaxView>>(OUTPUT_URL, {
    key: 'output-tax-list',
    query: { limit: 100 },
  })
  const items = computed(() => request.data.value?.data ?? [])

  async function save(payload: OutputTaxFormData) {
    const result = await apiFetch<MutationResponse>(OUTPUT_URL, { method: 'POST', body: payload })
    await request.refresh()
    return result
  }

  async function remove(id: string): Promise<MutationResponse> {
    const item = items.value.find(entry => entry.id === id)

    if (!item) {
      throw new Error('Dokumen pajak keluaran tidak ditemukan.')
    }

    const result = await apiFetch<MutationResponse>(`${OUTPUT_URL}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { ...item, status: 'Cancelled' },
    })
    await request.refresh()
    return result
  }

  return { items, pending: request.pending, error: request.error, refresh: request.refresh, save, remove }
}