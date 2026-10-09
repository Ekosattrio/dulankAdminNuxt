import { readJSON, writeJSON } from './data'
import type { OnlineOrder, OnlineOrderFormData } from '../types/online-order'

const FILE_NAME = 'online-orders.json'

export function getOnlineOrders(query?: { search?: string; status?: string; paymentStatus?: string }): OnlineOrder[] {
  const orders = readJSON<OnlineOrder[]>(FILE_NAME, [])
  if (!query) return orders

  const search = query.search?.toLowerCase().trim()
  const status = query.status?.trim()
  const paymentStatus = query.paymentStatus?.trim()

  return orders.filter((o: OnlineOrder) => {
    const matchesSearch = !search ||
      o.customer.toLowerCase().includes(search) ||
      o.reference.toLowerCase().includes(search) ||
      o.biller.toLowerCase().includes(search)
    const matchesStatus = !status || o.status === status
    const matchesPayment = !paymentStatus || o.paymentStatus === paymentStatus

    return matchesSearch && matchesStatus && matchesPayment
  })
}

export function saveOnlineOrder(formData: OnlineOrderFormData, id?: number | string): OnlineOrder {
  const orders = readJSON<OnlineOrder[]>(FILE_NAME, [])
  const grandTotal = Math.max(0, Number(formData.grandTotal) || 0)
  const paid = Math.max(0, Number(formData.paid) || 0)
  const due = Math.max(0, grandTotal - paid)
  const paymentStatus = due === 0 ? 'Paid' : 'Unpaid'
  const status = formData.status || (due === 0 ? 'Complete' : 'Pending')

  if (id !== undefined && id !== null) {
    const idx = orders.findIndex((o: OnlineOrder) => String(o.id) === String(id))
    const existing = orders[idx]
    if (idx === -1 || !existing) {
      throw createError({ statusCode: 404, statusMessage: 'Online order not found' })
    }

    const updated: OnlineOrder = {
      id: existing.id,
      customer: formData.customer.trim(),
      avatar: formData.avatar || existing.avatar || '/assets/img/customer/customer1.jpg',
      reference: formData.reference || existing.reference,
      date: formData.date || existing.date,
      status,
      grandTotal,
      paid,
      due,
      paymentStatus,
      biller: formData.biller?.trim() || existing.biller || 'Webstore',
      channel: formData.channel || existing.channel || 'Website Official',
      paymentMethod: formData.paymentMethod || existing.paymentMethod,
    }

    orders[idx] = updated
    writeJSON(FILE_NAME, orders)
    return updated
  }

  const numericIds = orders.map((o: OnlineOrder) => Number(o.id)).filter((n: number) => !isNaN(n))
  const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1
  const reference = formData.reference || `ONL${String(nextId).padStart(3, '0')}`

  const newOrder: OnlineOrder = {
    id: nextId,
    customer: formData.customer.trim(),
    avatar: formData.avatar || '/assets/img/customer/customer1.jpg',
    reference,
    date: formData.date || new Date().toISOString().slice(0, 10),
    status,
    grandTotal,
    paid,
    due,
    paymentStatus,
    biller: formData.biller?.trim() || 'Webstore',
    channel: formData.channel || 'Website Official',
    paymentMethod: formData.paymentMethod || 'Midtrans',
  }

  orders.unshift(newOrder)
  writeJSON(FILE_NAME, orders)
  return newOrder
}

export function recordOnlineOrderPayment(id: number | string, amount: number, method: string): OnlineOrder {
  const orders = readJSON<OnlineOrder[]>(FILE_NAME, [])
  const idx = orders.findIndex((o: OnlineOrder) => String(o.id) === String(id))
  const order = orders[idx]
  if (idx === -1 || !order) {
    throw createError({ statusCode: 404, statusMessage: 'Online order not found' })
  }

  const payAmt = Math.max(0, Number(amount) || 0)
  order.paid = Math.min(order.grandTotal, (order.paid || 0) + payAmt)
  order.due = Math.max(0, order.grandTotal - order.paid)
  order.paymentMethod = method || order.paymentMethod

  if (order.due === 0) {
    order.paymentStatus = 'Paid'
    order.status = 'Complete'
  }

  orders[idx] = order
  writeJSON(FILE_NAME, orders)
  return order
}

export function deleteOnlineOrder(id: number | string): boolean {
  const orders = readJSON<OnlineOrder[]>(FILE_NAME, [])
  const initialLen = orders.length
  const filtered = orders.filter((o: OnlineOrder) => String(o.id) !== String(id))

  if (filtered.length === initialLen) {
    throw createError({ statusCode: 404, statusMessage: 'Online order not found' })
  }

  writeJSON(FILE_NAME, filtered)
  return true
}

