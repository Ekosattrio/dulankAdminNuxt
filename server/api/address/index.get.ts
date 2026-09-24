import { defineEventHandler, getQuery } from 'h3'
import type { AddressResponse, CustomerAddress, SupplierAddress, AddressFilterParams } from '~/types/address'

export default defineEventHandler((event): AddressResponse => {
  const query = getQuery(event) as AddressFilterParams
  const addressData = readJSON<{
    stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
    customers: CustomerAddress[]
    suppliers: SupplierAddress[]
  }>('address.json')

  const stats = addressData.stats
  let customers: CustomerAddress[] = [...(addressData.customers || [])]
  let suppliers: SupplierAddress[] = [...(addressData.suppliers || [])]

  // Filter Search
  if (query.search) {
    const q = query.search.toLowerCase()
    customers = customers.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.detailAddress.toLowerCase().includes(q) ||
      c.otherDetail.toLowerCase().includes(q)
    )

    suppliers = suppliers.filter(s =>
      s.userId.toLowerCase().includes(q) ||
      s.user.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.fullAddress.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.province.toLowerCase().includes(q)
    )
  }

  // Filter Status
  if (query.status && query.status !== 'All' && query.status !== '') {
    const s = query.status.toLowerCase()
    customers = customers.filter(c => c.status.toLowerCase() === s)
    suppliers = suppliers.filter(supp => supp.status.toLowerCase() === s)
  }

  return {
    stats,
    customers,
    suppliers,
    totalCustomers: customers.length,
    totalSuppliers: suppliers.length
  }
})

