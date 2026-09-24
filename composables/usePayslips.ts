import type { PayslipItem, PayslipFormData, PayslipFilterParams } from '#server/types/payslip'

interface ResponseData {
  success: boolean
  data: PayslipItem[]
  message?: string
}

export function usePayslips(filterParams?: Ref<PayslipFilterParams> | PayslipFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/payslips', {
    key: 'payslips-list',
    query: params
  })

  const payslips = computed<PayslipItem[]>(() => data.value?.data ?? [])

  const savePayslip = async (payload: PayslipFormData) => {
    const res = await $fetch<{ success: boolean; data: PayslipItem; message?: string }>('/api/payslips', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePayslip = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/payslips/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    payslips,
    pending,
    error,
    refresh,
    savePayslip,
    deletePayslip
  }
}
