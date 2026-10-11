import type { MoneyTransferFormData, MoneyTransferView } from '#server/types/money-transfer'

interface TransferResponse {
  success: boolean
  data: MoneyTransferView[]
}

interface MutationResponse {
  success: boolean
  data?: MoneyTransferView
  message: string
}

/**
 * Transfer antar rekening — backend Laravel `/api/v1/admin/money-transfers`.
 * Transfer adalah catatan finansial (menggerakkan ledger dua sisi) sehingga
 * backend tidak menyediakan penghapusan; `deleteTransfer` memberi pesan jelas.
 */
export function useMoneyTransfers() {
  const { data, pending, error, refresh } = useApiFetch<TransferResponse>('/api/v1/admin/money-transfers', {
    key: 'money-transfer-list',
    query: { limit: 100 },
  })
  const transfers = computed<MoneyTransferView[]>(() => data.value?.data ?? [])

  async function saveTransfer(payload: MoneyTransferFormData) {
    const result = await apiFetch<MutationResponse>('/api/v1/admin/money-transfers', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return result
  }
  async function deleteTransfer(_id: string): Promise<MutationResponse> {
    void _id

    throw new Error('Transfer tidak dapat dihapus; catat transfer pembalik untuk koreksi.')
  }
  return { transfers, pending, error, refresh, saveTransfer, deleteTransfer }
}