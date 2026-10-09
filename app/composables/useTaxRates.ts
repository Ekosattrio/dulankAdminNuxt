import type { TaxRateItem, TaxRateInput, TaxRatesResponse } from '#server/types/tax-rates'

export function useTaxRates() {
  const { data: response, pending, error, refresh } = useApiFetch<TaxRatesResponse>('/api/tax-rates', {
    key: 'tax-rates-data',
    lazy: false
  })

  const taxes = computed(() => response.value?.data || [])

  async function addTax(payload: TaxRateInput) {
    const res = await apiFetch<{ success: boolean; data: TaxRateItem; message?: string }>('/api/tax-rates', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function updateTax(id: number, payload: Partial<TaxRateInput>) {
    const res = await apiFetch<{ success: boolean; data: TaxRateItem; message?: string }>(`/api/tax-rates/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteTax(id: number) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/tax-rates/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    taxes,
    pending,
    error,
    refresh,
    addTax,
    updateTax,
    deleteTax
  }
}

