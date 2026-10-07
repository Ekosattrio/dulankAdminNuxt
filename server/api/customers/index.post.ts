import { defineEventHandler, readBody } from 'h3'
import type { Customer, CustomerFormData } from '~/types/customer'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerFormData>(event)

  if (!body.name || !body.email) {
    return {
      success: false,
      message: 'Name and email are required'
    }
  }

  const customers = readJSON<Customer[]>('customers.json', [])
  let resultItem: Customer

  if (body.id) {
    const idx = customers.findIndex(c => c.id === body.id)
    if (idx !== -1 && customers[idx]) {
      const existing = customers[idx]!
      resultItem = {
        ...existing,
        name: body.name,
        email: body.email,
        type: body.type || existing.type,
        phone: body.phone || existing.phone,
        balance: body.balance !== undefined ? body.balance : existing.balance
      }
      customers[idx] = resultItem
    } else {
      return { success: false, message: 'Customer not found' }
    }
  } else {
    const nextNum = customers.length + 1
    const newId = `ID${String(nextNum).padStart(6, '0')}`
    resultItem = {
      id: newId,
      customerId: newId,
      name: body.name,
      email: body.email,
      type: body.type || 'General',
      balance: body.balance || 0,
      phone: body.phone || '-',
      channel: body.channel || 'Website',
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
  return createResponse(resultItem, { message: body.id ? 'Customer updated' : 'Customer created' })
})

