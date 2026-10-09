import { defineEventHandler, getRouterParam } from 'h3'
import type { CustomerRecord } from '~/types/customer'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, message: 'ID required' }

  const customers = readJSON<CustomerRecord[]>('customers.json', [])
  const index = customers.findIndex(c => c.id === id || c.customerId === id)

  if (index >= 0) {
    customers[index] = { ...customers[index]!, status: 'Archived' }
    writeJSON('customers.json', customers)
    return createResponse({ id, deleted: true })
  }

  return { success: false, message: 'Customer not found' }
})

