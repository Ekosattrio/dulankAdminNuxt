import type { Invoice, InvoiceFormData, InvoiceFilterParams } from '#server/types/invoice'

interface ResponseData {
  success: boolean
  data: Invoice[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Invoice
  message?: string
}

/**
 * Invoice (monitoring) — backend Laravel `/api/v1/admin/invoices`.
 * Invoice dibuat otomatis dari order/penjualan; admin hanya memantau,
 * mencatat pembayaran, dan mengekspor PDF.
 */
export function useInvoices(filterParams?: Ref<InvoiceFilterParams> | InvoiceFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/invoices', {
    key: 'invoices-list',
    query
  })

  const invoices = computed<Invoice[]>(() => data.value?.data ?? [])

  const saveInvoice = async (_payload: InvoiceFormData) => {
    void _payload

    throw new Error('Invoice dibuat otomatis dari order/penjualan, tidak dapat dibuat manual.')
  }

  const deleteInvoice = async (_id: string) => {
    void _id

    throw new Error('Invoice tidak dapat dihapus; gunakan pembayaran/status untuk mengelolanya.')
  }

  const recordPayment = async (
    invoiceNo: string,
    payload: { amount: number; method?: string; date?: string; notes?: string }
  ) => {
    const res = await apiFetch<MutationResponse>(
      `/api/v1/admin/invoices/${encodeURIComponent(invoiceNo)}/payments`,
      { method: 'POST', body: payload }
    )

    await refresh()
    return res
  }

  return {
    invoices,
    pending,
    error,
    refresh,
    saveInvoice,
    deleteInvoice,
    recordPayment
  }
}