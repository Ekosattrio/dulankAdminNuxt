import { defineEventHandler, getQuery } from 'h3'
import type { Customer, CustomerFilterParams } from '~/types/customer'

export default defineEventHandler((event) => {
  const query = getQuery(event) as CustomerFilterParams
  let customers = readJSON<Customer[]>('customers.json', [])

  if (query.search) {
    const q = query.search.toLowerCase()
    customers = customers.filter(c =>
      c.customerId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    )
  }

  if (query.type && query.type !== 'All' && query.type !== '') {
    customers = customers.filter(c => c.type.toLowerCase() === query.type!.toLowerCase())
  }

  if (query.startDate || query.endDate) {
    customers = customers.filter(c => isDateWithinRange(c.dateJoin, query.startDate, query.endDate))
  }

  return createResponse(customers, { total: customers.length })
})

