import type { Sale } from '~/types/sale'
import type { SalesHistoryEntry } from '#server/types/sales-document'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sale ID is required',
    })
  }

  const allSales = readSalesData<Sale>('sales.json')
  const newSales = allSales.filter((s) => s.id !== id && s.saleNo !== id)

  if (allSales.length === newSales.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sale record not found',
    })
  }

  const record = allSales.find((s) => s.id === id || s.saleNo === id)!
  const history = readSalesData<SalesHistoryEntry>('sales-history.json')
  history.unshift({
    id: randomUUID(),
    saleId: record.id,
    saleNo: record.saleNo,
    customer: record.customer,
    date: new Date().toLocaleDateString('en-GB'),
    total: record.total,
    created: 'Admin',
    kind: 'deleted',
  })
  writeJSON('sales-history.json', history)
  writeJSON('sales.json', newSales)

  return createResponse({ id }, 'Sale deleted successfully')
})
