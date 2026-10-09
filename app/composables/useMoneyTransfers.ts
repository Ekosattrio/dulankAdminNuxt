import type { MoneyTransferFormData, MoneyTransferView } from '#server/types/money-transfer'

interface TransferResponse { success: boolean; data: MoneyTransferView[] }

export function useMoneyTransfers() {
  const { data, pending, error, refresh } = useApiFetch<TransferResponse>('/api/money-transfers', { key: 'money-transfer-list' })
  const transfers = computed<MoneyTransferView[]>(() => data.value?.data ?? [])

  async function saveTransfer(payload: MoneyTransferFormData) {
    const result = await apiFetch<{ success: boolean; data: MoneyTransferView; message: string }>('/api/money-transfers', { method: 'POST', body: payload })
    await refresh()
    return result
  }
  async function deleteTransfer(id: string) {
    const result = await apiFetch<{ success: boolean; message: string }>(`/api/money-transfers/${id}`, { method: 'DELETE' })
    await refresh()
    return result
  }
  return { transfers, pending, error, refresh, saveTransfer, deleteTransfer }
}

