import type { POSProduct } from '#server/types/pos'
export default defineEventHandler(() => createResponse(readSalesData<POSProduct>('pos-products.json')))
