import { defineEventHandler, getQuery } from 'h3'
import type { Supplier, SupplierFilterParams } from '~/types/supplier'

export default defineEventHandler((event) => {
  const query = getQuery(event) as SupplierFilterParams
  let suppliers = readJSON<Supplier[]>('suppliers.json', [])

  if (query.search) {
    const q = query.search.toLowerCase()
    suppliers = suppliers.filter(s =>
      s.supplierId.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.contact.toLowerCase().includes(q) ||
      s.picName.toLowerCase().includes(q)
    )
  }

  if (query.status && query.status !== 'All' && query.status !== '') {
    suppliers = suppliers.filter(s => s.status.toLowerCase() === query.status!.toLowerCase())
  }

  return createResponse(suppliers, { total: suppliers.length })
})

