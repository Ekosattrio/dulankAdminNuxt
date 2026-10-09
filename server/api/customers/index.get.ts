import { defineEventHandler, getQuery } from 'h3'
import type { Customer, CustomerAccountEntry, CustomerFilterParams, CustomerRecord } from '~/types/customer'

export default defineEventHandler((event) => {
  const query = getQuery(event) as CustomerFilterParams
  const records = readJSON<CustomerRecord[]>('customers.json', [])
  const accountEntries = readJSON<CustomerAccountEntry[]>('customer-account-entries.json', [])
  const balanceByCustomer = accountEntries.reduce((totals, entry) => {
    totals.set(entry.customerId, (totals.get(entry.customerId) || 0) + entry.amount)
    return totals
  }, new Map<string, number>())
  let customers: Customer[] = records
    .filter(customer => customer.status !== 'Archived')
    .map(customer => ({ ...customer, balance: balanceByCustomer.get(customer.customerId) || 0 }))

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

