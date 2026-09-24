import { defineEventHandler, getRouterParam } from 'h3'
import type { Customer } from '~/types/customer'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, message: 'ID required' }

  let customers = readJSON<Customer[]>('customers.json', [])
  const prevCount = customers.length
  customers = customers.filter(c => c.id !== id && c.customerId !== id)

  if (customers.length < prevCount) {
    writeJSON('customers.json', customers)
    return createResponse({ id, deleted: true })
  }

  return { success: false, message: 'Customer not found' }
})

