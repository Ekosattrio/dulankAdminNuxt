import type { SalesHistoryEntry } from '#server/types/sales-document'
export default defineEventHandler(() =>
  createResponse(readSalesData<SalesHistoryEntry>('sales-history.json')),
)
