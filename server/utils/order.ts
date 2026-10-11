import type { Order, OrderFilterParams, OrderFormData, OrderStats, OrderStatus } from '#server/types/order'
import { isDateWithinRange } from './dateRange'

const filename = 'orders.json'
const statuses: OrderStatus[] = ['Complete', 'Waiting', 'Processing', 'Cancel']

function readItems(): Order[] { return readJSON<Order[]>(filename, []) }
function writeItems(items: Order[]): void { writeJSON(filename, items) }

export function listOrders(filters: OrderFilterParams = {}): Order[] {
  const items = readItems()
  const search = filters.search?.trim().toLowerCase()
  const shipping = filters.shipping?.trim().toLowerCase()
  const status = filters.status?.trim().toLowerCase()

  return items.filter((item) => {
    if (search) {
      const haystack = [item.no, item.customer, item.statusBy, item.salesChannel, item.shipping]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }

    if (shipping && item.shipping.toLowerCase() !== shipping) {
      return false
    }

    if (status && item.status.toLowerCase() !== status) {
      return false
    }

    if (filters.startDate || filters.endDate) {
      if (!isDateWithinRange(item.orderDate, filters.startDate, filters.endDate)) {
        return false
      }
    }

    return true
  })
}

export function getOrderStats(): OrderStats {
  const items = readItems()
  const customers = new Set(items.map((i) => i.customer.trim().toLowerCase()))

  return {
    totalOrders: items.length,
    totalCustomers: customers.size,
    totalComplete: items.filter((i) => i.status === 'Complete').length,
    totalCancel: items.filter((i) => i.status === 'Cancel').length,
  }
}

export function getOrderById(id: string): Order | null {
  const items = readItems()
  return items.find((item) => String(item.id) === String(id) || item.no === id) || null
}

export function updateOrderStatus(id: string, status: OrderStatus, statusBy: string = 'Admin'): Order {
  if (!statuses.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order status' })
  }
  const items = readItems()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  const current = items[index]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }
  const updated: Order = {
    ...current,
    status,
    statusBy,
  }

  items[index] = updated
  writeItems(items)
  return updated
}

export function createOrder(payload: OrderFormData): Order {
  const items = readItems()
  if (!payload.customer?.trim() || !payload.orderDate?.trim() || !payload.salesChannel?.trim() || !payload.shipping?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Customer, order date, sales channel, and shipping are required' })
  }
  if (payload.status && !statuses.includes(payload.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order status' })
  }
  const nextId = String(items.length ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1)
  const nextNo = payload.no || `ORD-${Date.now().toString().slice(-8)}`

  const newOrder: Order = {
    id: nextId,
    no: nextNo,
    customer: payload.customer.trim(),
    orderDate: payload.orderDate.trim(),
    status: payload.status || 'Waiting',
    statusBy: payload.statusBy || 'Admin',
    salesChannel: payload.salesChannel.trim(),
    shipping: payload.shipping.trim(),
  }

  items.unshift(newOrder)
  writeItems(items)
  return newOrder
}

export function deleteOrder(id: string): Order {
  const items = readItems()
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  const [removed] = items.splice(index, 1)
  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }
  writeItems(items)
  return removed
}
