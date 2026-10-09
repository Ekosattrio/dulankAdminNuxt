import payments from '../data/payments.json'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sources = {
  'payments.json': payments,
}

export function readPaymentData<T>(filename: keyof typeof sources): T[] {
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
