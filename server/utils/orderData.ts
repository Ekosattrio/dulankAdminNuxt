import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Order } from '#server/types/order'

const runtimePath = join(process.cwd(), 'data', 'orders.json')
const seedPath = join(process.cwd(), 'server', 'data', 'orders.json')

export function readOrderData(): Order[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as Order[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime order data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as Order[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed order data:', error)
  }

  return []
}

export function writeOrderData(data: Order[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write order data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist order data',
    })
  }
}
