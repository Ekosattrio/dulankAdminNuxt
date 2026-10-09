import type {
  CalculatorListingCategory,
  CalculatorListingRow,
  CalculatorModerationInput,
  CalculatorPartnerKind,
  CalculatorPartnerRow,
} from '#server/types/calculator-marketplace'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: { total?: number }
}

export function useCalculatorPartners(kind: CalculatorPartnerKind) {
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<CalculatorPartnerRow[]>>('/api/calculator/partners', {
    key: `calculator-partners-${kind}`,
    query: { kind },
  })
  const partners = computed(() => data.value?.data ?? [])

  async function moderatePartner(id: string, input: CalculatorModerationInput) {
    const response = await apiFetch<ApiResponse<CalculatorPartnerRow>>(`/api/calculator/partners/${id}/moderate`, { method: 'POST', body: input })
    await refresh()
    return response
  }

  async function deletePartner(id: string) {
    const response = await apiFetch<ApiResponse<CalculatorPartnerRow>>(`/api/calculator/partners/${id}`, { method: 'DELETE' })
    await refresh()
    return response
  }

  return { partners, pending, error, refresh, moderatePartner, deletePartner }
}

export function useCalculatorListings(category: CalculatorListingCategory) {
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<CalculatorListingRow[]>>('/api/calculator/listings', {
    key: `calculator-listings-${category}`,
    query: { category },
  })
  const listings = computed(() => data.value?.data ?? [])

  async function deleteListing(id: string) {
    const response = await apiFetch<ApiResponse<CalculatorListingRow>>(`/api/calculator/listings/${id}`, { method: 'DELETE' })
    await refresh()
    return response
  }

  async function moderateSource(sourcePartnerId: string, input: CalculatorModerationInput) {
    const response = await apiFetch<ApiResponse<CalculatorPartnerRow>>(`/api/calculator/partners/${sourcePartnerId}/moderate`, { method: 'POST', body: input })
    await refresh()
    return response
  }

  return { listings, pending, error, refresh, deleteListing, moderateSource }
}
