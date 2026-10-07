import { defineEventHandler, getRouterParam } from 'h3'
import type { CustomerAddress, SupplierAddress } from '~/types/address'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, message: 'Address ID required' }
  }

  const fileData = readJSON<{
    stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
    customers: CustomerAddress[]
    suppliers: SupplierAddress[]
  }>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: []
  })

  const initialCustLength = fileData.customers.length
  fileData.customers = fileData.customers.filter(c => c.id !== id)

  if (fileData.customers.length < initialCustLength) {
    fileData.stats.totalAddress = Math.max(0, fileData.stats.totalAddress - 1)
    writeJSON('address.json', fileData)
    return { success: true, message: `Address ${id} deleted successfully` }
  }

  const initialSuppLength = (fileData.suppliers || []).length
  fileData.suppliers = (fileData.suppliers || []).filter(s => s.id !== id)

  if (fileData.suppliers.length < initialSuppLength) {
    fileData.stats.totalAddress = Math.max(0, fileData.stats.totalAddress - 1)
    writeJSON('address.json', fileData)
    return { success: true, message: `Supplier address ${id} deleted successfully` }
  }

  return { success: false, message: `Address ${id} not found` }
})
