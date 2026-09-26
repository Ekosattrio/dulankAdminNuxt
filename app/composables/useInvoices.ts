import type { Invoice, InvoiceFormData, InvoiceFilterParams } from '#server/types/invoice'

interface ResponseData {
  success: boolean
  data: Invoice[]
  message?: string
}

export function useInvoices(filterParams?: Ref<InvoiceFilterParams> | InvoiceFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/invoices', {
    key: 'invoices-list',
    query: params
  })

  const invoices = computed<Invoice[]>(() => data.value?.data ?? [])

  const saveInvoice = async (payload: InvoiceFormData) => {
    const res = await $fetch<{ success: boolean; data: Invoice; message?: string }>('/api/invoices', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteInvoice = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/invoices/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    invoices,
    pending,
    error,
    refresh,
    saveInvoice,
    deleteInvoice
  }
}
