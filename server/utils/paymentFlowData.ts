import paymentBalances from '../data/payment-balances.json'
import paymentInflows from '../data/payment-inflows.json'
import paymentOutflows from '../data/payment-outflows.json'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sources = {
  'payment-balances.json': paymentBalances,
  'payment-inflows.json': paymentInflows,
  'payment-outflows.json': paymentOutflows,
}

export type PaymentFlowFilename = keyof typeof sources

export function readPaymentFlowData<T>(filename: PaymentFlowFilename): T[] {
  const file = resolve(process.cwd(), 'data', filename)
  if (!existsSync(file)) return structuredClone(sources[filename]) as T[]
  try {
    const records: unknown = JSON.parse(readFileSync(file, 'utf8'))
    if (!Array.isArray(records)) throw new Error('Expected an array')
    return records as T[]
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to read ${filename}; existing data was preserved`,
    })
  }
}
