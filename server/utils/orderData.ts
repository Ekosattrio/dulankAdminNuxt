import type { Order } from '#server/types/order'
import { readJSON, writeJSON } from './data'

const ORDERS_FILE = 'orders.json'

export function readOrderData(): Order[] {
  return readJSON<Order[]>(ORDERS_FILE, [])
}

export function writeOrderData(data: Order[]): void {
  writeJSON(ORDERS_FILE, data)
}

