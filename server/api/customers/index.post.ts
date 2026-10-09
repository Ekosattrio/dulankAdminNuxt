import { defineEventHandler, readBody } from 'h3'
import type { Customer, CustomerAccountEntry, CustomerFormData, CustomerRecord } from '~/types/customer'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerFormData>(event)

  if (!body.name || !body.email) {
    return {
      success: false,
      message: 'Name and email are required'
    }
  }

  const customers = readJSON<CustomerRecord[]>('customers.json', [])
  let resultItem: CustomerRecord

  if (body.id) {
    const idx = customers.findIndex(c => c.id === body.id)
    if (idx !== -1 && customers[idx]) {
      const existing = customers[idx]!
      resultItem = {
        ...existing,
        name: body.name,
        email: body.email,
        type: body.type || existing.type,
        phone: body.phone || existing.phone
      }
      customers[idx] = resultItem
    } else {
      return { success: false, message: 'Customer not found' }
    }
  } else {
    const nextNum = customers.reduce((highest, customer) => {
      const numericId = Number(customer.customerId.replace(/\D/g, ''))
      return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest
    }, 0) + 1
    const newId = `ID${String(nextNum).padStart(6, '0')}`
    resultItem = {
      id: newId,
      customerId: newId,
      name: body.name,
      email: body.email,
      type: body.type || 'General',
      phone: body.phone || '-',
      channel: 'Offline',
      dateJoin: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\./g, ':'),
      lastSeen: 'Just now',
      status: 'Active'
    }
    customers.unshift(resultItem)
  }

  writeJSON('customers.json', customers)
  const balance = readJSON<CustomerAccountEntry[]>('customer-account-entries.json', [])
    .filter(entry => entry.customerId === resultItem.customerId)
    .reduce((total, entry) => total + entry.amount, 0)
  const responseItem: Customer = { ...resultItem, balance }
  return createResponse(responseItem, body.id ? 'Customer updated' : 'Customer created')
})

