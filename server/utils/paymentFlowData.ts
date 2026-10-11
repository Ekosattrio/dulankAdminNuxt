import { readJSON, writeJSON } from './data'

export type PaymentFlowFilename = 'payment-balances.json' | 'payment-inflows.json' | 'payment-outflows.json'

export function readPaymentFlowData<T>(filename: PaymentFlowFilename): T[] {
  const records = readJSON<unknown>(filename)
  if (!Array.isArray(records)) {
    throw createError({ statusCode: 500, statusMessage: `Unable to read ${filename}; expected an array` })
  }
  return records as T[]
}

export function writePaymentFlowData<T>(filename: PaymentFlowFilename, records: T[]): void {
  writeJSON(filename, records)
}
