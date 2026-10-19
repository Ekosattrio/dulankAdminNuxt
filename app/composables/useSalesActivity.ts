import type { SalesHistoryEntry } from '#server/types/sales-document'

/**
 * Riwayat sales — backend `/api/v1/admin/sales`.
 *
 * Backend mencatat pembatalan pada level Order (webstore), bukan pada
 * dokumen sales; riwayat "dihapus" tidak disimpan sama sekali. Daftar ini
 * dikosongkan secara jujur sampai mekanisme riwayat dokumen tersedia.
 */
export function useSalesHistory() {
  const history = computed<SalesHistoryEntry[]>(() => [])

  return {
    history,
    pending: ref(false),
    error: ref(null),
    refresh: async () => {},
  }
}

/**
 * Pembayaran sales — backend `/api/v1/admin/sales/{number}/payments`.
 */
export function useSalesPayments() {
  async function addPayment(saleNo: string, payload: { amount: number; method?: string; notes?: string }) {
    await apiFetch(`/api/v1/admin/sales/${encodeURIComponent(saleNo)}/payments`, {
      method: 'POST',
      body: payload,
    })
  }

  return { addPayment }
}