import type { PayslipItem, PayslipFormData, PayslipFilterParams } from '#server/types/payslip'

interface ResponseData {
  success: boolean
  data: PayslipItem[]
  message?: string
}

export function usePayslips() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/payslips', {
    key: 'payslips-list'
  })

  const payslips = computed<PayslipItem[]>(() => data.value?.data ?? [])

  const savePayslip = async (payload: PayslipFormData) => {
    const res = await apiFetch<{ success: boolean; data: PayslipItem; message?: string }>('/api/payslips', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePayslip = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/payslips/${id}`, {
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
