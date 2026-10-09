import sales from '../data/sales.json'
import invoices from '../data/invoices.json'
import deliveryNotes from '../data/delivery-notes.json'
import quotations from '../data/quotations.json'
import salesReturns from '../data/sales-returns.json'
import requestQuotations from '../data/request-quotations.json'
import posProducts from '../data/pos-products.json'
import salesHistory from '../data/sales-history.json'
import salesVouchers from '../data/sales-vouchers.json'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sources = {
  'sales.json': sales,
  'invoices.json': invoices,
  'delivery-notes.json': deliveryNotes,
  'quotations.json': quotations,
  'sales-returns.json': salesReturns,
  'request-quotations.json': requestQuotations,
  'pos-products.json': posProducts,
  'sales-history.json': salesHistory,
  'sales-vouchers.json': salesVouchers,
}

/** Existing runtime data, including [], always takes precedence over the source JSON. */
export function readSalesData<T>(filename: keyof typeof sources): T[] {
  const file = resolve(process.cwd(), 'data', filename)
  if (!existsSync(file)) return structuredClone(sources[filename]) as T[]
  try {
    const records: unknown = JSON.parse(readFileSync(file, 'utf8'))
    if (!Array.isArray(records)) throw new Error('Expected an array')
    return records as T[]
  } catch {
    // Never replace damaged runtime data with the source records during a save.
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to read ${filename}; existing data was preserved`,
    })
  }
}
