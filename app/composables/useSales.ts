import type { Sale, SaleFormData, SaleFilterParams } from '#server/types/sale'

interface ResponseData {
  success: boolean
  data: Sale[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface SaveSaleResponse {
  success: boolean
  data: Sale
  message?: string
}

interface MutationResponse {
  success: boolean
  message?: string
}

/**
 * Sales/POS — backend Laravel `/api/v1/admin/sales`.
 *
 * Bentuk resource backend sengaja dibuat identik dengan tipe admin
 * (`Sale`), sehingga mapping hanya terjadi di payload tulis.
 */
export function useSales(filterParams?: Ref<SaleFilterParams> | SaleFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    channel: params.value.channel || undefined,
    limit: 100,
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/sales', {
    key: 'sales-list',
    query
  })

  const sales = computed<Sale[]>(() => data.value?.data ?? [])

  const saveSale = async (payload: SaleFormData) => {
    const items = (payload.items ?? []).map(item => ({
      productId: item.productId ? Number(item.productId) : null,
      name: item.name,
      quantity: item.qty,
      price: item.price,
      unit: item.unit ?? null,
      spec: item.specs ?? null
    }))

    const subTotal =
      payload.subTotal ??
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = payload.tax ?? 0
    const deliveryFee = payload.deliveryFee ?? 0
    const discount = payload.discount ?? 0
    const total = Math.max(subTotal - discount, 0) + tax + deliveryFee

    const res = await apiFetch<SaveSaleResponse>('/api/v1/admin/sales', {
      method: 'POST',
      body: {
        customer: payload.customer || 'Walk-in Customer',
        items,
        deliveryFee,
        discount,
        delivery: payload.delivery ?? 'Pick Up',
        channel: payload.channel ?? 'POS',
        method: payload.method ?? 'Cash',
        paidAmount: payload.status === 'Paid' ? total : 0
      }
    })

    await refresh()
    return res
  }

  /**
   * Aksi hapus dimigrasikan menjadi void order (audit timeline tetap utuh).
   */
  const deleteSale = async (id: string) => {
    const res = await apiFetch<MutationResponse>(
      `/api/v1/admin/sales/${encodeURIComponent(id)}/void`,
      { method: 'POST' }
    )

    await refresh()
    return res
  }

  const recordPayment = async (
    id: string,
    payload: { amount: number; method?: string; date?: string; notes?: string }
  ) => {
    const res = await apiFetch<SaveSaleResponse>(
      `/api/v1/admin/sales/${encodeURIComponent(id)}/payments`,
      { method: 'POST', body: payload }
    )

    await refresh()
    return res
  }

  return {
    sales,
    pending,
    error,
    refresh,
    saveSale,
    deleteSale,
    recordPayment
  }
}
