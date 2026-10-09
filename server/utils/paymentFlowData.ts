import paymentBalances from '../data/payment-balances.json'
import paymentInflows from '../data/payment-inflows.json'
import paymentOutflows from '../data/payment-outflows.json'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { writeJSON } from './data'
import { normalizePaymentFlow } from './paymentFlow'
import type { PaymentFlowFormData, PaymentFlowRecord } from '#server/types/payment-flow'

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

export function writePaymentFlowData<T>(filename: PaymentFlowFilename, data: T[]): void {
  writeJSON(filename, data)
}

export async function savePaymentInflowDomain(body: PaymentFlowFormData): Promise<{ record: PaymentFlowRecord; isNew: boolean }> {
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-inflows.json')

  if (body.id) {
    const index = records.findIndex((record) => record.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Payment inflow not found' })
    records[index] = normalizePaymentFlow('inflow', body, records[index])
    writePaymentFlowData('payment-inflows.json', records)
    return { record: records[index]!, isNew: false }
  }

  const next = normalizePaymentFlow('inflow', body)
  records.unshift(next)
  writePaymentFlowData('payment-inflows.json', records)
  return { record: next, isNew: true }
}

export async function deletePaymentInflowDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Payment inflow ID is required' })
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-inflows.json')
  const next = records.filter((record) => record.id !== id && record.refNo !== id)
  if (next.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: 'Payment inflow not found' })
  }
  writePaymentFlowData('payment-inflows.json', next)
  return { id }
}

export async function savePaymentOutflowDomain(body: PaymentFlowFormData): Promise<{ record: PaymentFlowRecord; isNew: boolean }> {
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-outflows.json')

  if (body.id) {
    const index = records.findIndex((record) => record.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Payment outflow not found' })
    records[index] = normalizePaymentFlow('outflow', body, records[index])
    writePaymentFlowData('payment-outflows.json', records)
    return { record: records[index]!, isNew: false }
  }

  const next = normalizePaymentFlow('outflow', body)
  records.unshift(next)
  writePaymentFlowData('payment-outflows.json', records)
  return { record: next, isNew: true }
}

export async function deletePaymentOutflowDomain(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Payment outflow ID is required' })
  const records = readPaymentFlowData<PaymentFlowRecord>('payment-outflows.json')
  const next = records.filter((record) => record.id !== id && record.refNo !== id)
  if (next.length === records.length) {
    throw createError({ statusCode: 404, statusMessage: 'Payment outflow not found' })
  }
  writePaymentFlowData('payment-outflows.json', next)
  return { id }
}
