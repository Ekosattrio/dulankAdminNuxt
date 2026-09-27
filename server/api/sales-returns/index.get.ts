import type { SalesReturn } from '#server/types/sales-return'
export default defineEventHandler(() => createResponse(readSalesData<SalesReturn>('sales-returns.json')))
